import {Game} from '../Game';
import {PlayerId, GameId, SpectatorId} from '../../common/Types';
import {once} from 'events';
import {EventEmitter} from 'events';
import * as prometheus from 'prom-client';
import {Database} from './Database';
import {CacheConfig} from './CacheConfig';
import {Clock} from '../../common/Timer';

const metrics = {
  start: new prometheus.Gauge({
    name: 'game_ids_get_all_instances_started',
    help: 'Time getAllInstances started',
    registers: [prometheus.register],
  }),
  end: new prometheus.Gauge({
    name: 'game_ids_get_all_instances_finished',
    help: 'Time getAllInstances finished',
    registers: [prometheus.register],
  }),
};

export class Cache extends EventEmitter {
  private loaded = false;
  private readonly games = new Map<GameId, Game | undefined>();
  private readonly participantIds = new Map<SpectatorId | PlayerId, GameId>();
  private readonly db = Database.getInstance();

  /** Map of game IDs and the time they were scheduled for eviction */
  private readonly evictionSchedule: Map<GameId, number> = new Map();
  private readonly config: CacheConfig;
  private readonly clock: Clock;

  constructor(config: CacheConfig, clock: Clock) {
    super();
    this.config = config;
    this.clock = clock;
  }

  private async getInstance(gameId: GameId) : Promise<void> {
    const game = await this.db.getGame(gameId);
    if (this.games.get(gameId) === undefined) {
      this.games.set(gameId, undefined);
      const participantIds: Array<SpectatorId | PlayerId> = [];
      if (game.spectatorId !== undefined) {
        this.participantIds.set(game.spectatorId, gameId);
        participantIds.push(game.spectatorId);
      }
      for (const player of game.players) {
        this.participantIds.set(player.id, gameId);
        participantIds.push(player.id);
      }
      try {
        this.db.storeParticipants({gameId, participantIds});
      } catch (e) {
        console.log(`Failed to store ${gameId}`);
      }
    }
  }

  private async getAllInstances(allGameIds: Array<GameId>): Promise<void> {
    metrics.start.set(this.clock.now());

    const sliceSize = 1000;
    for (let i = 0; i < allGameIds.length; i += sliceSize) {
      const slice = allGameIds.slice(i, i + sliceSize);
      await Promise.all(slice.map((x) => this.getInstance(x))).then(() => {
        console.log(`Loaded ${i} to ${i + slice.length} of ${allGameIds.length}`);
      });
    }
    metrics.end.set(this.clock.now());
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

      // TODO(kberg): Eventually these three lines will be unnecessary. They're actually
      // unnecessary after the first run.
      const allGameIds = await this.db.getGameIds();
      const filtered = allGameIds.filter((id) => !this.games.has(id));
      await this.getAllInstances(filtered);
    } catch (err) {
      console.error('error loading all games', err);
    }
    this.loaded = true;
    this.emit('loaded');
    if (this.config.sweep === 'auto') {
      scheduleSweep(this, this.config.sleepMillis);
    }
  }

  public async getGames(): Promise<{games:Map<GameId, Game | undefined>, participantIds:Map<SpectatorId | PlayerId, GameId>}> {
    if (!this.loaded) {
      await once(this, 'loaded');
    }
    return {games: this.games, participantIds: this.participantIds};
  }

  public mark(gameId: GameId) {
    console.log(`Marking ${gameId} to be evicted in ${this.config.evictMillis}ms`);
    this.evictionSchedule.set(gameId, this.clock.now() + this.config.evictMillis);
  }

  public sweep() {
    console.log('Starting sweep');
    const now = this.clock.now();
    for (const entry of this.evictionSchedule.entries()) {
      if (entry[1] <= now) {
        const gameId = entry[0];
        console.log(`evicting ${gameId}`);
        this.evict(gameId);
        this.evictionSchedule.delete(gameId);
      }
    }
    console.log('Finished sweep');
  }

  private evict(gameId: GameId) {
    const game = this.games.get(gameId);
    if (game === undefined) return;
    game.getPlayers().forEach((p) => p.tearDown());
    this.games.set(gameId, undefined); // Setting to undefied is the same as "not yet loaded."
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
