import {Game} from '../Game';
import {PlayerId, GameId, SpectatorId} from '../../common/Types';
import {GameIdLedger} from './IDatabase';

/**
 * Loads games from javascript memory or database
 * Loads games from database sequentially as needed
 */
export interface IGameLoader {
  add(game: Game): Promise<void>;
  getIds(): Promise<Array<GameIdLedger>>;
  /**
   * Fetches a game from the GameLoader cache.
   *
   * @param {GameId | PlayerId | SpectatorId} id the id of the game to retrieve, or
   * one of its player ids, or its spectator id.
   * @param {boolean} forceLoad (default is false.) When true always load from the database,
   * which refreshes the cache. This should never be true during an active game except when
   * doing an adminstrative rollback. Don't even make this true for normal game undos.
   * That's what `restoreGameAt` is for.
   */
  getGame(id: GameId | PlayerId | SpectatorId, forceLoad?: boolean): Promise<Game | undefined>;
  restoreGameAt(gameId: GameId, saveId: number): Promise<Game>;
  /**
   * Mark a game to be purged from the cache. It will be
   * purged a a future call to `sweep`.
   *
   * @param {GameId} gameId the game to be removed from the cache. Only call this for completed games.
   */
  mark(gameId: GameId): void;
}
