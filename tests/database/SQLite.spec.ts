import {describeDatabaseSuite} from './databaseSuite';
import {IGame} from '../../src/server/IGame';
import {IN_MEMORY_SQLITE_PATH, SQLite} from '../../src/server/database/SQLite';
import {GameId} from '../../src/common/Types';
import {RunResult} from 'sqlite3';
import {ITestDatabase, Status} from './ITestDatabase';

class TestSQLite extends SQLite implements ITestDatabase {
  public lastSaveGamePromise: Promise<void> = Promise.resolve();

  constructor() {
    super(IN_MEMORY_SQLITE_PATH, true);
  }

  public get database() {
    return this.db;
  }

  public override saveGame(game: IGame): Promise<void> {
    this.lastSaveGamePromise = super.saveGame(game);
    return this.lastSaveGamePromise;
  }

  public async status(gameId: GameId): Promise<Status> {
    const rows = await this.asyncAll('SELECT DISTINCT status FROM games WHERE game_id = ? ORDER BY save_id DESC LIMIT 1', [gameId]);
    const statusText = rows[0].status;

    if (statusText === 'running' || statusText === 'finished') {
      return statusText;
    }
    throw new Error('Invalid status for ' + gameId + ': ' + statusText);
  }

  async completedTime(gameId: GameId): Promise<number | undefined> {
    const row = await this.asyncGet('SELECT completed_time FROM completed_game WHERE game_id = $1', [gameId]);
    return row.completed_time;
  }

  setCompletedTime(gameId: GameId, timestampSeconds: number): Promise<RunResult> {
    return this.asyncRun('UPDATE completed_game SET completed_time = to_timestamp(?) WHERE game_id = ?', [timestampSeconds, gameId]);
  }
}

describeDatabaseSuite({
  name: 'SQLite',
  constructor: () => new TestSQLite(),
  omit: {
    markFinished: true,
  },
  stats: {
    type: 'SQLite',
    path: ':memory:',
    size_bytes: -1,
  },
});
