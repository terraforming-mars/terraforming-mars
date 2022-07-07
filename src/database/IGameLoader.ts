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
   * Gets a game from javascript memory or pulls from database if needed.
   * @param {GameId} gameId the id of the game to retrieve
   * @param {boolean} bypassCache always pull from database
   */
  getByGameId(gameId: GameId, bypassCache: boolean): Promise<Game | undefined>;
  getByParticipantId(playerId: PlayerId | SpectatorId): Promise<Game | undefined>;
  restoreGameAt(gameId: GameId, saveId: number): Promise<Game>;
}
