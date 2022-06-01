require('dotenv').config();
import {expect} from 'chai';
import {Game} from '../../src/Game';
import {TestPlayers} from '../TestPlayers';
import {PostgreSQL} from '../../src/database/PostgreSQL';
import {Database} from '../../src/database/Database';
import {restoreTestDatabase} from '../utils/setup';
import {sleep} from '../TestingUtils';

/*
 How to set up this integration test.

 This test only works manually.
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
}

describe('PostgreSQL', () => {
  let db: TestPostgreSQL;

  beforeEach(async () => {
    db = new TestPostgreSQL();
    Database.getInstance = () => db;
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
    await new Promise<void>((resolve) => {
      db.getGames((err, allGames) => {
        expect(err).eq(undefined);
        expect(allGames).deep.eq(['game-id-1212']);
        resolve();
      });
    });
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

    db.getPlayerCount(game.id, (err, playerCount) => {
      expect(err).to.be.undefined;
      expect(playerCount).to.eq(1);
    });
  });

  it('does not find player count for game by id', async () => {
    const player = TestPlayers.BLACK.newPlayer();
    const game = Game.newInstance('game-id-1212', [player], player);
    await db.saveGamePromise;
    expect(game.lastSaveId).eq(1);

    db.getPlayerCount('notfound', (err, playerCount) => {
      expect(err).to.be.undefined;
      expect(playerCount).to.be.undefined;
    });
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
    });
  });
});
