import * as prometheus from 'prom-client';
import {Database} from './Database';
import {Game} from '../Game';
import {IGame} from '../IGame';
import {PlayerId, GameId, SpectatorId, isGameId, ParticipantId} from '../../common/Types';
import {IGameLoader} from './IGameLoader';
import {GameIdLedger} from './IDatabase';
import {Cache} from './Cache';
import {MultiMap} from 'mnemonist';
import {timeAsync} from '../utils/timer';
import {durationToMilliseconds} from '../utils/durations';
import {CacheConfig} from './CacheConfig';
import {Clock} from '../../common/Timer';

const metrics = {
  initialize: new prometheus.Gauge({
    name: 'gameloader_initialize',
    help: 'Time to load all games',
    registers: [prometheus.register],
  }),
  evictions: new prometheus.Counter({
    name: 'gameloader_evictions',
    help: 'Game evictions count',
    registers: [prometheus.register],
  }),
};

/**
 * Loads games from javascript memory or database
 * Loads games from database sequentially as needed
 */
export class GameLoader implements IGameLoader {
  private static instance?: GameLoader;

  private cache: Cache;
  private readonly config: CacheConfig;
  private readonly clock: Clock;
  private purgedGames: Array<GameId>;

  private constructor(config: CacheConfig, clock: Clock) {
    this.config = config;
    this.clock = clock;
    this.cache = new Cache(config, clock);
    this.purgedGames = [];
    timeAsync(this.cache.load())
      .then((v) => {
        metrics.initialize.set(v.duration);
      });
  }

  public static getInstance(): IGameLoader {
    if (GameLoader.instance === undefined) {
      const config = parseConfigString(process.env.GAME_CACHE ?? '');
      GameLoader.instance = new GameLoader(config, new Clock());
    }
    return GameLoader.instance;
  }

  public static newTestInstance(config: CacheConfig, clock: Clock): GameLoader {
    return new GameLoader(config, clock);
  }

  public resetForTesting(): void {
    this.cache = new Cache(this.config, this.clock);
    this.cache.load();
  }

  public async add(game: IGame): Promise<void> {
    const d = await this.cache.getGames();
    d.games.set(game.id, game);
    if (game.spectatorId !== undefined) {
      d.participantIds.set(game.spectatorId, game.id);
    }
    for (const player of game.players) {
      d.participantIds.set(player.id, game.id);
    }
  }

  public async getIds(): Promise<Array<GameIdLedger>> {
    const d = await this.cache.getGames();
    const map = new MultiMap<GameId, ParticipantId>();
    d.participantIds.forEach((gameId, participantId) => map.set(gameId, participantId));
    const arry: Array<[GameId, Array<PlayerId | SpectatorId>]> = Array.from(map.associations());
    return arry.map(([gameId, participantIds]) => ({gameId, participantIds}));
  }

  public async isCached(gameId: GameId): Promise<boolean> {
    const d = await this.cache.getGames();
    return d.games.get(gameId) !== undefined;
  }

  public async getGame(id: GameId | PlayerId | SpectatorId, forceLoad: boolean = false): Promise<IGame | undefined> {
    const d = await this.cache.getGames();
    const gameId = isGameId(id) ? id : d.participantIds.get(id);
    if (gameId === undefined) return undefined;

    // 1. Check the cache as long as forceLoad isn't true.
    if (forceLoad === false && d.games.get(gameId) !== undefined) return d.games.get(gameId);

    // 2. The game isn't cached. If it's in the database, there will still be an entry
    // for it in the cache.
    if (d.games.has(gameId)) {
      try {
        const serializedGame = await Database.getInstance().getGame(gameId);
        if (serializedGame === undefined) {
          console.error(`GameLoader:loadGame: game ${gameId} not found`);
          return undefined;
        }
        const game = Game.deserialize(serializedGame);
        await this.add(game);
        console.log(`GameLoader loaded game ${gameId} into memory from database`);
        return game;
      } catch (e) {
        console.error('GameLoader:loadGame', e);
        return undefined;
      }
    }

    // Otherwise the game ID isn't valid.
    return undefined;
  }

  public async restoreGameAt(gameId: GameId, saveId: number): Promise<IGame> {
    const current = await this.getGame(gameId);
    if (current === undefined) {
      console.error('GameLoader cannot find game ' + gameId);
      throw new Error('Cannot find game');
    }
    const currentSaveId = current.lastSaveId;
    const deletes = (currentSaveId - saveId) - 1;
    if (deletes > 0) {
      await Database.getInstance().deleteGameNbrSaves(gameId, deletes);
    }
    const serializedGame = await Database.getInstance().getGame(gameId);
    const game = Game.deserialize(serializedGame);
    await this.add(game);
    game.undoCount++;
    return game;
  }

  public mark(gameId: GameId) {
    this.cache.mark(gameId);
  }

  public sweep() {
    this.cache.sweep();
  }

  public async completeGame(game: IGame) {
    const database = Database.getInstance();
    await database.saveGame(game);
    try {
      this.mark(game.id);
      await database.markFinished(game.id);
      await this.maintenance();
    } catch (err) {
      console.error(err);
    }
  }

  public saveGame(game: IGame): Promise<void> {
    if (this.purgedGames.includes(game.id)) {
      throw new Error('This game no longer exists');
    }
    return Database.getInstance().saveGame(game);
  }

  public async maintenance() {
    const database = Database.getInstance();
    const purgedGames = await database.purgeUnfinishedGames();
    this.purgedGames.push(...purgedGames);
    await database.compressCompletedGames();
  }
}

function parseConfigString(stringValue: string): CacheConfig {
  const options: CacheConfig = {
    sweep: 'manual', // default is manual
    evictMillis: durationToMilliseconds('15m'),
    sleepMillis: durationToMilliseconds('5m'),
  };
  const parsed = Object.fromEntries((stringValue ?? '').split(';').map((s) => s.split('=', 2)));
  if (parsed.sweep === 'auto' || parsed.sweep === 'manual') {
    options.sweep = parsed.sweep;
  } else if (parsed.sweep !== undefined) {
    throw new Error('invalid sweep option from GAME_CACHE: ' + parsed.sweep);
  }
  const evictMillis = durationToMilliseconds(parsed.eviction_age);
  if (!isNaN(evictMillis)) options.evictMillis = evictMillis;
  const sleepMillis = durationToMilliseconds(parsed.sweep_freq);
  if (!isNaN(sleepMillis)) options.sleepMillis = sleepMillis;
  return options;
}
