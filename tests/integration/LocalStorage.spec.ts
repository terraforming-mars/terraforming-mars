const path = require('path');
const fs = require('fs');
import {tmpdir} from 'os';

import {describeDatabaseSuite} from '../database/databaseSuite';
import {ITestDatabase, Status} from '../database/ITestDatabase';
import {IGame} from '../../src/server/IGame';
import {LocalStorage} from '../../src/server/database/LocalStorage';
import {GameId} from '../../src/common/Types';

/*
 * This test can be run with `npm run test:integration` as long as the test is set up
 * correctly.
 */
class TestLocalStorage extends LocalStorage implements ITestDatabase {
  public afterEach(): void {
    super.clear();
  }
  public status(_gameId: GameId): Promise<Status> {
    throw new Error('Not yet implemented');
  }

  async completedTime(_gameId: GameId): Promise<number | undefined> {
    throw new Error('Not yet implemented');
  }

  async setCompletedTime(_gameId: GameId, _timestampSeconds: number): Promise<void> {
    throw new Error('Not yet implemented');
  }
}

describeDatabaseSuite({
  name: 'LocalStorage',
  constructor: () => new TestLocalStorage(),
  omit: {
    markFinished: true,
    purgeUnfinishedGames: true,
  },
  stats: {
    'type': 'Local Storage',
  },
});
