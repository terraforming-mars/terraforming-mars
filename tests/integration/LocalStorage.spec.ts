const path = require('path');
const fs = require('fs');
import {tmpdir} from 'os';

import {describeDatabaseSuite} from '../database/databaseSuite';
import {ITestDatabase, Status} from '../database/ITestDatabase';
import {IGame} from '../../src/server/IGame';
import {LocalStorage} from '../../src/server/database/LocalStorage';
import {GameId} from '../../src/common/Types';


const map = {};

global.localStorage = {
  length: 0,
  key: function (i) {
    return map[Object.keys(map)[i]] ?? null;
  },
  getItem: function (key) {
    return map[key] ?? null;
  },
  removeItem: function (key) {
    delete map[key];
    global.localStorage.length = Object.keys(map).length;
  },
  setItem: function (key, value) {
    map[key] = value;
    global.localStorage.length = Object.keys(map).length;
  }
};

/*
 * This test can be run with `npm run test:integration` as long as the test is set up
 * correctly.
 */
class TestLocalStorage extends LocalStorage implements ITestDatabase {
//  public lastSaveGamePromise: Promise<void> = Promise.resolve();
//   public readonly promises: Array<Promise<void>> = [];

  // Tests can wait for saveGamePromise since save() is called inside other methods.
//  public override async saveGame(game: IGame): Promise<void> {
//    this.lastSaveGamePromise = super.saveGame(game);
//    this.promises.push(this.lastSaveGamePromise);
//    return this.lastSaveGamePromise;
//  }

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
