require('dotenv').config();
import {expect} from 'chai';
import {ITestDatabase, describeDatabaseSuite} from '../database/IDatabaseSuite';
import {Game} from '../../src/Game';
import {PostgreSQL} from '../../src/database/PostgreSQL';
import {TestPlayers} from '../TestPlayers';

/*
 * This test can be run with `npm run test:integration` as long as the test is set up
 * correctly.
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

  otherTests: (dbFunction: () => ITestDatabase) => {
    it('saveGame with the same saveID', async () => {
      const db = dbFunction() as TestPostgreSQL;
      const player = TestPlayers.BLACK.newPlayer();
      const game = Game.newInstance('game-id-1212', [player], player);
      await db.saveGamePromise;

      await db.saveGame(game);
      await db.saveGame(game);
      player.megaCredits = 105;
      await db.saveGame(game);

      expect(await db.getSaveIds(game.id)).has.members([0, 1, 2, 3]);
      const serializedv3 = await db.getGameVersion(game.id, 3);
      expect(serializedv3.players[0].megaCredits).eq(105);
      expect(game.lastSaveId).eq(4);

      player.megaCredits = 77;
      game.lastSaveId = 3;
      await db.saveGame(game);
      expect(await db.getSaveIds(game.id)).has.members([0, 1, 2, 3]);
      expect(db.getStatistics().saveCount).eq(5);

      // Resaving #3 results in a save conflict. It was updated.
      expect(db.getStatistics().saveConflictNormalCount).eq(1);

      // Loading v3 shows that it has the revised value of megacredits.
      const newSerializedv3 = await db.getGameVersion(game.id, 3);
      expect(newSerializedv3.players[0].megaCredits).eq(77);
      expect(game.lastSaveId).eq(4);
    });
  },
});
