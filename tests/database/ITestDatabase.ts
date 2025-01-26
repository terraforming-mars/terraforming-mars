import {IDatabase} from '../../src/server/database/IDatabase';
import {GameId} from '../../src/common/Types';

export type Status = 'running' | 'finished';

export interface ITestDatabase extends IDatabase {
  /**
   * On any call to saveGame() store the promise here. That allows the app to wait for database
   * saves that are otherwise deeply nested in the game code.
   *
   * This is usually done by overriding save() and storing the promise returned from it.
   */
  lastSaveGamePromise: Promise<void>;

  /**
   * Shut down operations after each test.
   */
  afterEach?(): Promise<void>;
  /**
   * Return the status of a given game id.
   */
  status(gameId: GameId): Promise<Status>;
  /**
   * If the game is waiting to be purged, return the time the game was completed. Otherwise, return `undefined`.
   */
  completedTime(gameId: GameId): Promise<number | undefined>;
  /**
   * Updates completed_game with the specified time.
   */
  setCompletedTime(gameId: GameId, timestampSeconds: number): Promise<unknown>;
}
