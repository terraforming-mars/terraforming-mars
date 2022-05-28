import {expect} from 'chai';
import {Game} from '../../src/Game';
import {GameId} from '../../src/common/Types';
import {TestPlayers} from '../TestPlayers';
import {IN_MEMORY_SQLITE_PATH, SQLite} from '../../src/database/SQLite';
import {Database} from '../../src/database/Database';
import {restoreTestDatabase} from '../utils/setup';
import {sleep} from '../TestingUtils';

class TestSQLite extends SQLite {
  public saveGamePromise: Promise<void> = Promise.resolve();

  constructor() {
    super(IN_MEMORY_SQLITE_PATH, true);
  }

  public get database() {
    return this.db;
  }

  public override saveGame(game: Game): Promise<void> {
    this.saveGamePromise = super.saveGame(game);
    return this.saveGamePromise;
  }

  public getSaveIds(gameId: GameId): Promise<Array<number>> {
    return new Promise((resolve, reject) => {
      const allSaveIds: Array<number> = [];
      const sql: string = 'SELECT distinct save_id FROM games WHERE game_id = ?';
      this.db.all(sql, [gameId], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        if (rows) {
          rows.forEach((row) => {
            allSaveIds.push(row.save_id);
          });
        }
        resolve(allSaveIds);
      });
    });
  }
}

describe('SQLite', () => {
  let db: TestSQLite;
  beforeEach(() => {
    db = new TestSQLite();
    Database.getInstance = () => db;
    return db.initialize();
  });

  afterEach(() => {
    restoreTestDatabase();
  });

  it('game is saved', async () => {
    const player = TestPlayers.BLACK.newPlayer();
    Game.newInstance('game-id-1212', [player], player);
    await db.saveGamePromise
      .then(() => db.getGames())
      .then((allGames) => expect(allGames).deep.eq(['game-id-1212']));
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

    await sleep(400);

    const saveIds = await db.getSaveIds(game.id);
    expect(saveIds).has.members([0, 3]);
  });

  it('gets player count', async () => {
    const player = TestPlayers.BLACK.newPlayer();
    const game = Game.newInstance('game-id-1212', [player], player);
    await db.saveGamePromise;
    expect(game.lastSaveId).eq(1);

    db.getPlayerCount(game.id, (err, playerCount) => {
      expect(err).to.be.undefined;
      expect(playerCount).to.eq(1);
    });
  });

  it('does not find player count by id', async () => {
    const player = TestPlayers.BLACK.newPlayer();
    const game = Game.newInstance('game-id-1212', [player], player);
    await db.saveGamePromise;
    expect(game.lastSaveId).eq(1);

    db.getPlayerCount('notfound', (err, gameData) => {
      expect(err).to.be.undefined;
      expect(gameData).to.be.undefined;
    });
  });

  it('purgeUnfinishedGames', async () => {
    const player = TestPlayers.BLACK.newPlayer();
    const game = Game.newInstance('game-id-1212', [player], player);
    await db.saveGamePromise;
    expect(game.lastSaveId).eq(1);

    await db.saveGame(game);
    await db.saveGame(game);
    await db.saveGame(game);

    expect(await db.getSaveIds(game.id)).has.members([0, 1, 2, 3]);

    await db.purgeUnfinishedGames('1');
    expect(await db.getSaveIds(game.id)).has.members([0, 1, 2, 3]);
    // Doesn't purge until the time has passed.
    await db.purgeUnfinishedGames('-1');
    // await db.purgeUnfinishedGames('0'); This doesn't work! I wonder if it's just too precise a clock problem.
    expect(await db.getSaveIds(game.id)).is.empty;
  });
});
