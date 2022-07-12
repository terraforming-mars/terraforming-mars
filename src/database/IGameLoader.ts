import {Game} from '../Game';
import {PlayerId, GameId, SpectatorId} from '../common/Types';

export type GameIdLedger = {id: GameId, participants: Array<SpectatorId | PlayerId>};

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
}
