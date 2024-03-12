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
  private readonly config: CacheConfig;
  private readonly clock: Clock;

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
