const path = require('path');
const fs = require('fs');
import {tmpdir} from 'os';

import {describeDatabaseSuite} from '../database/databaseSuite';
import {ITestDatabase, Status} from '../database/ITestDatabase';
import {IGame} from '../../src/server/IGame';
import {LocalFilesystem} from '../../src/server/database/LocalFilesystem';
import {GameId} from '../../src/common/Types';

/*
 * This test can be run with `npm run test:integration` as long as the test is set up
 * correctly.
 */
class TestLocalFilesystem extends LocalFilesystem implements ITestDatabase {
  public lastSaveGamePromise: Promise<void> = Promise.resolve();
  public readonly promises: Array<Promise<void>> = [];

  constructor() {
    super(fs.mkdtempSync(path.join(tmpdir(), 'local-filesystem-test')));
    console.log(`running in ${this.dbFolder}`);
  }

  // Tests can wait for saveGamePromise since save() is called inside other methods.
  public override async saveGame(game: IGame): Promise<void> {
    this.lastSaveGamePromise = super.saveGame(game);
    this.promises.push(this.lastSaveGamePromise);
    return this.lastSaveGamePromise;
  }

  public async afterEach() {
    fs.rmSync(this.dbFolder, {recursive: true});
  }

  public override async stats(): Promise<{[key: string]: string | number}> {
    const response = await super.stats();
    response['path'] = 'abc';
    response['history_path'] = 'def';
    return response;
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
  name: 'LocalFilesystem',
  constructor: () => new TestLocalFilesystem(),
  omit: {
    markFinished: true,
    purgeUnfinishedGames: true,
  },
  stats: {
    'history_path': 'def',
    'path': 'abc',
    'type': 'Local Filesystem',
  },
});
