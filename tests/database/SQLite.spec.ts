import {ITestDatabase, describeDatabaseSuite} from './databaseSuite';
import {Game} from '../../src/server/Game';
import {IN_MEMORY_SQLITE_PATH, SQLite} from '../../src/server/database/SQLite';

class TestSQLite extends SQLite implements ITestDatabase {
  public lastSaveGamePromise: Promise<void> = Promise.resolve();

  constructor() {
    super(IN_MEMORY_SQLITE_PATH, true);
  }

  public get database() {
    return this.db;
  }

  public override saveGame(game: Game): Promise<void> {
    this.lastSaveGamePromise = super.saveGame(game);
    return this.lastSaveGamePromise;
  }
}

describeDatabaseSuite({
  name: 'SQLite',
  constructor: () => new TestSQLite(),
  stats: {
    type: 'SQLite',
    path: ':memory:',
    size_bytes: -1,
  },
});
