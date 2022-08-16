import {ITestDatabase, describeDatabaseSuite} from '../database/databaseSuite';
import {Game} from '../../src/server/Game';
import {LocalFilesystem} from '../../src/server/database/LocalFilesystem';
const path = require('path');
const fs = require('fs');
import {tmpdir} from 'os';

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
  public override async saveGame(game: Game): Promise<void> {
    this.lastSaveGamePromise = super.saveGame(game);
    this.promises.push(this.lastSaveGamePromise);
    return this.lastSaveGamePromise;
  }

  public async afterEach() {
    fs.rmdirSync(this.dbFolder, {recursive: true});
  }

  public override async stats(): Promise<{[key: string]: string | number}> {
    const response = await super.stats();
    response['path'] = 'abc';
    response['history_path'] = 'def';
    return response;
  }
}

describeDatabaseSuite({
  name: 'LocalFilesystem',
  constructor: () => new TestLocalFilesystem(),
  omit: {
    cleanGame: true,
    purgeUnfinishedGames: true,
  },
  stats: {
    'history_path': 'def',
    'path': 'abc',
    'type': 'Local Filesystem',
  },
});
