import {describeDatabaseSuite} from './databaseSuite';
import {IGame} from '../../src/server/IGame';
import {LocalStorage} from '../../src/server/database/LocalStorage';
import {GameId} from '../../src/common/Types';
import {ITestDatabase, Status} from './ITestDatabase';

class TestLocalStorage extends LocalStorage implements ITestDatabase {
  public lastSaveGamePromise: Promise<void> = Promise.resolve();

  constructor() {
    super();
    // LocalStorage's backing store is process-global, so reset it for each test.
    this.clear();
  }

  public override saveGame(game: IGame): Promise<void> {
    this.lastSaveGamePromise = super.saveGame(game);
    return this.lastSaveGamePromise;
  }

  // markFinished, purgeUnfinishedGames, and sessions aren't supported by
  // LocalStorage, so the tests that depend on these are omitted, and they're
  // the only callers of these three methods.
  public status(_gameId: GameId): Promise<Status> {
    throw new Error('not implemented');
  }

  public completedTime(_gameId: GameId): Promise<number | undefined> {
    throw new Error('not implemented');
  }

  public setCompletedTime(_gameId: GameId, _timestampSeconds: number): Promise<unknown> {
    throw new Error('not implemented');
  }
}

describeDatabaseSuite({
  name: 'LocalStorage',
  constructor: () => new TestLocalStorage(),
  omit: {
    markFinished: true,
    purgeUnfinishedGames: true,
    sessions: true,
  },
  stats: {
    type: 'Local Storage',
  },
});
