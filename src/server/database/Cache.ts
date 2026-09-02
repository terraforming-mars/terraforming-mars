import {IGame} from '../IGame';
import {GameId, ParticipantId} from '../../common/Types';
import {once} from 'events';
import {EventEmitter} from 'events';
import {Database} from './Database';
import {CacheConfig} from './CacheConfig';
import {Clock} from '../../common/Timer';
import {partition} from '@/common/utils/utils';

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
    let evicted = 0;
    let trimmed = 0;
    for (const [gameId, game] of this.games) {
      if (game === undefined) {
        continue;
      }
      if (this.shouldEvict(gameId, game)) {
        console.log('evicting', gameId);
        this.evict(gameId);
        this.evictionSchedule.delete(gameId);
        evicted++;
      } else if (this.shouldTrim(gameId, game)) {
        console.log('trimming', gameId);
        game.gameLog = [];
        trimmed++;
      }
    }

    if (evicted > 0) {
      this.emit('evicted', evicted);
    }
    if (trimmed > 0) {
      this.emit('trimmed', trimmed);
    }

    console.log('Finished sweep');
  }

  /** The ids of games due for eviction: those scheduled by mark() and those idle past the threshold. */
  private shouldEvict(gameId: GameId, game: IGame): boolean {
    const now = this.clock.now();
    const evictionTimeMillis = this.evictionSchedule.get(gameId);
    if (evictionTimeMillis !== undefined && evictionTimeMillis <= now) {
      return true;
    }
    // Abandoned games: resident but idle past the threshold.
    if (this.config.idleMillis > 0) {
      // Only solo games are idle-evicted with few saves are evicted.
      if (game.players.length > 1 || game.lastSaveId > Cache.MAX_SAVES_FOR_IDLE_EVICTION) {
        return false;
      }
      const last = this.lastAccess.get(gameId);
      if (last !== undefined && now - last > this.config.idleMillis) {
        return true;
      }
    }
    return false;
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

  private shouldTrim(gameId: GameId, game: IGame): boolean {
    if (this.config.idleMillis > 0) {
      const now = this.clock.now();
      if (game.gameLog.length === 0) {
        return false;
      }
      const last = this.lastAccess.get(gameId);
      if (last !== undefined && now - last > this.config.idleMillis) {
        return true;
      }
    }
    return false;
  }

  /**
   * Counts of resident games split by whether their log has been trimmed from memory.
   * A resident game with an empty log has had its log trimmed (see `trimIdleLogs`).
   */
  public countLoadedGames(): {trimmed: number, untrimmed: number} {
    const games = Array.from(this.games.values()).filter((game) => game !== undefined);
    const [trimmed, untrimmed] = partition(games, (game) => game.gameLog.length === 0);
    return {trimmed: trimmed.length, untrimmed: untrimmed.length};
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
