import {Game} from '../Game';
import {PlayerId, GameId, SpectatorId} from '../common/Types';

export type GameIdLedger = {id: GameId, participants: Array<SpectatorId | PlayerId>};

/**
 * Loads games from javascript memory or database
 * Loads games from database sequentially as needed
 */
export interface IGameLoader {
  add(game: Game): Promise<void>;
  getLoadedGameIds(): Promise<Array<GameIdLedger>>;
  /**
   * Fetches a game from the GameLoader cache.
   *
   * @param {GameId} gameId the id of the game to retrieve
   * @param {boolean} forceLoad when true always load from the database, which refreshes the cache.
   * This should never be true during an active game except when doing an adminstrative rollback.
   * Don't even make this true for normal game undos. That's what `restoreGameAt` is for.
   */
  getByGameId(gameId: GameId, forceLoad: boolean): Promise<Game | undefined>;
  getByParticipantId(playerId: PlayerId | SpectatorId): Promise<Game | undefined>;
  restoreGameAt(gameId: GameId, saveId: number): Promise<Game>;
}
