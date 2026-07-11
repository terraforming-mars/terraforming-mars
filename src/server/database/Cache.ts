import {IGame} from '../IGame';
import {GameId, ParticipantId} from '../../common/Types';
import {once} from 'events';
import {EventEmitter} from 'events';
import {Database} from './Database';
import {CacheConfig} from './CacheConfig';
import {Clock} from '../../common/Timer';

export class Cache extends EventEmitter {
  private loaded = false;
  private readonly games = new Map<GameId, IGame | undefined>();
  private readonly participantIds = new Map<ParticipantId, GameId>();
  private readonly db = Database.getInstance();

  /** Map of game IDs and the time they were scheduled for eviction */
  private readonly evictionSchedule: Map<GameId, number> = new Map();
  /** Map of resident game IDs and the last time each was accessed. */
  private readonly lastAccess: Map<GameId, number> = new Map();
  private readonly config: CacheConfig;
  private readonly clock: Clock;

  // Idle eviction only unloads barely-played games; one with more than this many
  // saves is considered established and is kept resident even when idle.
  private static readonly MAX_SAVES_FOR_IDLE_EVICTION = 3;

  constructor(config: CacheConfig, clock: Clock) {
    super();
    this.config = config;
    this.clock = clock;
  }

  public async load(): Promise<void> {
    try {
      console.log('Preloading IDs.');
      const entries = await this.db.getParticipants();
      for (const entry of entries) {
        const gameId = entry.gameId;
        if (this.games.get(gameId) === undefined) {
          this.games.set(gameId, undefined);
          entry.participantIds.forEach((participant) => this.participantIds.set(participant, gameId));
        }
      }
      console.log(`Preloaded ${entries.length} IDs.`);
    } catch (err) {
      console.error('error loading all games', err);
    }
    this.loaded = true;
    this.emit('loaded');
    if (this.config.sweep === 'auto') {
      scheduleSweep(this, this.config.sleepMillis);
    }
  }

  public async getGames(): Promise<{games:Map<GameId, IGame | undefined>, participantIds:Map<ParticipantId, GameId>}> {
    if (!this.loaded) {
      await once(this, 'loaded');
    }
    return {games: this.games, participantIds: this.participantIds};
  }

  public mark(gameId: GameId) {
    console.log(`Marking ${gameId} to be evicted in ${this.config.evictMillis}ms`);
    this.evictionSchedule.set(gameId, this.clock.now() + this.config.evictMillis);
  }

  /** Records that `gameId` was just accessed, resetting its idle time. */
  public touch(gameId: GameId) {
    this.lastAccess.set(gameId, this.clock.now());
  }

  /**
   * Returns the time in milliseconds since `gameId` was last accessed, or
   * undefined if the game is not resident in memory.
   */
  public idleTimeMillis(gameId: GameId): number | undefined {
    const last = this.lastAccess.get(gameId);
    return last === undefined ? undefined : this.clock.now() - last;
  }

  /**
   * Evicts games that are due for eviction: those scheduled by mark() and those
   * idle past the threshold.
   */
  public sweep(): void {
    console.log('Starting sweep');
    const toEvict = this.gamesToEvict();
    for (const gameId of toEvict) {
      console.log('evicting', gameId);
      this.evict(gameId);
      this.evictionSchedule.delete(gameId);
    }
    if (toEvict.size > 0) {
      this.emit('evicted', toEvict.size);
    }
    console.log('Finished sweep');
  }

  /** The ids of games due for eviction: those scheduled by mark() and those idle past the threshold. */
  private gamesToEvict(): Set<GameId> {
    const now = this.clock.now();
    const toEvict = new Set<GameId>();
    for (const [gameId, evictionTimeMillis] of this.evictionSchedule.entries()) {
      if (evictionTimeMillis <= now) {
        toEvict.add(gameId);
      }
    }
    // Abandoned games: resident but idle past the threshold.
    if (this.config.idleMillis > 0) {
      for (const [gameId, game] of this.games) {
        if (game === undefined) {
          continue;
        }
        // Only solo games are idle-evicted with few saves are evicted.
        if (game.players.length > 1 || game.lastSaveId > Cache.MAX_SAVES_FOR_IDLE_EVICTION) {
          continue;
        }
        const last = this.lastAccess.get(gameId);
        if (last !== undefined && now - last > this.config.idleMillis) {
          toEvict.add(gameId);
        }
      }
    }
    return toEvict;
  }

  private evict(gameId: GameId) {
    const game = this.games.get(gameId);
    if (game === undefined) {
      return;
    }
    game.players.forEach((p) => p.tearDown());
    this.games.set(gameId, undefined); // Setting to undefied is the same as "not yet loaded."
    this.lastAccess.delete(gameId);
  }

  public countLoadedGames(): number {
    return [...this.games.values()].filter((game) => game !== undefined).length;
  }

  /** Idle time, in milliseconds, of every game currently resident in memory. */
  public idleTimes(): Array<number> {
    const now = this.clock.now();
    const times: Array<number> = [];
    for (const [gameId, game] of this.games) {
      if (game === undefined) {
        continue;
      }
      const last = this.lastAccess.get(gameId);
      if (last !== undefined) {
        times.push(now - last);
      }
    }
    return times;
  }
}

function scheduleSweep(cache: Cache, sleepMillis: number) {
  console.log(`Sweeper sleeping for ${sleepMillis}ms`);
  setTimeout(() => {
    try {
      cache.sweep();
    } catch (err) {
      console.error(err);
    }
    scheduleSweep(cache, sleepMillis);
  }, sleepMillis);
}
