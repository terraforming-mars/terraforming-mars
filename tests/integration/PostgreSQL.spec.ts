require('dotenv').config();
import {ITestDatabase, describeDatabaseSuite} from '../database/IDatabaseSuite';
import {Game} from '../../src/Game';
import {PostgreSQL} from '../../src/database/PostgreSQL';
import {use} from 'chai';
import chaiAsPromised = require('chai-as-promised');
use(chaiAsPromised);

/*
 How to set up this integration test.

 This test only works manually.
*/
class TestPostgreSQL extends PostgreSQL implements ITestDatabase {
  public saveGamePromise: Promise<void> = Promise.resolve();

  constructor() {
    super({
      user: 'tfmtest',
      database: 'tfmtest',
      host: 'localhost',
      password: process.env.POSTGRES_INTEGRATION_TEST_PASSWORD,
    });
  }

  // Tests can wait for saveGamePromise since save() is called inside other methods.
  public override saveGame(game: Game): Promise<void> {
    this.saveGamePromise = super.saveGame(game);
    return this.saveGamePromise;
  }

  public override async stats() {
    const response = await super.stats();
    response['size-bytes-games'] = 'any';
    response['size-bytes-game-results'] = 'any';
    response['size-bytes-database'] = 'any';
    return response;
  }

  public async afterEach() {
    return this.client.query('DROP TABLE games').then(() => {
      this.client.query('DROP TABLE game_results');
    }).catch((err) => {
      throw err;
    });
  }

  public getStatistics() {
    return this.statistics;
  }
}

describeDatabaseSuite({
  name: 'PostgreSQL',
  constructor: () => new TestPostgreSQL(),
  omitPurgeUnfinishedGames: true,
  stats: {
    'type': 'POSTGRESQL',
    'pool-total-count': 1,
    'pool-idle-count': 1,
    'pool-waiting-count': 0,
    'size-bytes-games': 'any',
    'size-bytes-game-results': 'any',
    'size-bytes-database': 'any',
    'save-confict-normal-count': 0,
    'save-confict-undo-count': 0,
    'save-count': 0,
    'save-error-count': 0,
  },
});
