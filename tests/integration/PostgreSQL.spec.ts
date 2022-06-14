require('dotenv').config();
import {use, expect} from 'chai';
import chaiAsPromised = require('chai-as-promised');
use(chaiAsPromised);

import {Game} from '../../src/Game';
import {TestPlayers} from '../TestPlayers';
import {PostgreSQL} from '../../src/database/PostgreSQL';
import {restoreTestDatabase, setTestDatabase} from '../utils/setup';
import {sleep} from '../TestingUtils';

/*
 * This test can be run with `npm run test:integration` as long as the test is set up
 * correctly.
 */
class TestPostgreSQL extends PostgreSQL {
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

  public async tearDown() {
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

describe('PostgreSQL', () => {
  let db: TestPostgreSQL;

  beforeEach(async () => {
    db = new TestPostgreSQL();
    setTestDatabase(db);
    await db.initialize();
  });

  afterEach(() => {
    restoreTestDatabase();
    return db.tearDown();
  });

  it('game is saved', async () => {
    const player = TestPlayers.BLACK.newPlayer();
    Game.newInstance('game-id-1212', [player], player);
    await db.saveGamePromise;
    await db.getGames().then((allGames) => expect(allGames).deep.eq(['game-id-1212']));
  });

  it('getGames - removes duplicates', async () => {
    const player = TestPlayers.BLACK.newPlayer();
    const game = Game.newInstance('game-id-1212', [player], player);
    await db.saveGamePromise;
    await db.saveGame(game);

    const allGames = await db.getGames();
    expect(allGames).deep.eq(['game-id-1212']);
  });

  it('getGames - includes finished games', async () => {
    const player = TestPlayers.BLACK.newPlayer();
    const game = Game.newInstance('game-id-1212', [player], player);
    await db.saveGamePromise;
    Game.newInstance('game-id-2323', [player], player);
    await db.saveGamePromise;

    db.cleanSaves(game.id);
    sleep(500);

    const allGames = await db.getGames();
    expect(allGames).deep.eq(['game-id-1212', 'game-id-2323']);
  });

  it('saveIds', async () => {
    const player = TestPlayers.BLACK.newPlayer();
    const game = Game.newInstance('game-id-1212', [player], player);
    await db.saveGamePromise;
    expect(game.lastSaveId).eq(1);

    await db.saveGame(game);
    await db.saveGame(game);
    await db.saveGame(game);

    const allSaveIds = await db.getSaveIds(game.id);
    expect(allSaveIds).has.members([0, 1, 2, 3]);
  });

  it('purge', async () => {
    const player = TestPlayers.BLACK.newPlayer();
    const game = Game.newInstance('game-id-1212', [player], player);
    await db.saveGamePromise;
    expect(game.lastSaveId).eq(1);

    await db.saveGame(game);
    await db.saveGame(game);
    await db.saveGame(game);

    expect(await db.getSaveIds(game.id)).has.members([0, 1, 2, 3]);

    db.cleanSaves(game.id);

    await sleep(1000);

    const saveIds = await db.getSaveIds(game.id);
    expect(saveIds).has.members([0, 3]);
  });

  it('gets player count by id', async () => {
    const player = TestPlayers.BLACK.newPlayer();
    const game = Game.newInstance('game-id-1212', [player], player);
    await db.saveGamePromise;
    expect(game.lastSaveId).eq(1);

    expect(db.getPlayerCount(game.id)).become(1);
  });

  it('does not find player count for game by id', async () => {
    const player = TestPlayers.BLACK.newPlayer();
    const game = Game.newInstance('game-id-1212', [player], player);
    await db.saveGamePromise;
    expect(game.lastSaveId).eq(1);

    expect(db.getPlayerCount('notfound')).is.rejected;
  });

  it('cleanSaves', async () => {
    const player = TestPlayers.BLACK.newPlayer();
    const game = Game.newInstance('game-id-1212', [player], player);
    await db.saveGamePromise;
    expect(game.lastSaveId).eq(1);

    await db.saveGame(game);
    await db.saveGame(game);
    await db.saveGame(game);

    expect(await db.getSaveIds(game.id)).has.members([0, 1, 2, 3]);

    db.cleanSaves(game.id);
    await sleep(500);
    const saveIds = await db.getSaveIds(game.id);
    expect(saveIds).has.members([0, 3]);
  });

  it('getGameVersion', async () => {
    const player = TestPlayers.BLACK.newPlayer();
    const game = Game.newInstance('game-id-1212', [player], player);
    await db.saveGamePromise;
    expect(game.lastSaveId).eq(1);

    player.megaCredits = 200;
    await db.saveGame(game);

    player.megaCredits = 300;
    await db.saveGame(game);

    player.megaCredits = 400;
    await db.saveGame(game);

    const allSaveIds = await db.getSaveIds(game.id);
    expect(allSaveIds).has.members([0, 1, 2, 3]);

    const serialized0 = await db.getGameVersion(game.id, 0);
    expect(serialized0.players[0].megaCredits).eq(0);

    const serialized1 = await db.getGameVersion(game.id, 1);
    expect(serialized1.players[0].megaCredits).eq(200);

    const serialized2 = await db.getGameVersion(game.id, 2);
    expect(serialized2.players[0].megaCredits).eq(300);

    const serialized3 = await db.getGameVersion(game.id, 3);
    expect(serialized3.players[0].megaCredits).eq(400);
  });

  it('loadCloneableGame', async () => {
    await expect(db.loadCloneableGame('123')).to.be.rejectedWith(/Game 123 not found/);

    const player = TestPlayers.BLACK.newPlayer();
    const game = Game.newInstance('game-id-123', [player], player);
    await db.saveGamePromise;
    const serialized = await db.loadCloneableGame('game-id-123');

    expect(game.id).eq(serialized.id);
  });

  it('saveGame with the same saveID', async () => {
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

  it('stats', async () => {
    const stats = await db.stats();
    stats['size-bytes-games'] = 'any';
    stats['size-bytes-game-results'] = 'any';
    stats['size-bytes-database'] = 'any';
    expect(stats).deep.eq({
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
    });
  });
});
