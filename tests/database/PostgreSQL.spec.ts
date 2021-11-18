import {expect} from 'chai';
import {Game, GameId} from '../../src/Game';
import {TestPlayers} from '../TestPlayers';
import {PostgreSQL} from '../../src/database/PostgreSQL';
import {Database} from '../../src/database/Database';
import {restoreTestDatabase} from '../utils/setup';

class TestPostgreSQL extends PostgreSQL {
  public saveGamePromise: Promise<void> = Promise.resolve();

  constructor() {
    super({
      database: 'tmtest',
      host: 'localhost',
    }, true);
  }

  public saveGame(game: Game): Promise<void> {
    this.saveGamePromise = super.saveGame(game);
    return this.saveGamePromise;
  };

  public getSaveIds(gameId: GameId): Promise<Array<number>> {
    return new Promise(() => {
      this.runQuietly('getSaveIds', 'SELECT distinct save_id FROM games WHERE game_id = $1', [gameId]).then(
        (res) => {
          const allSaveIds: Array<number> = [];
          res.rows.forEach((row) => {
            allSaveIds.push(row.save_id);
          });
          return Promise.resolve(allSaveIds);
        });
    });
  }
}

describe('PostgreSQL', () => {
  let db: TestPostgreSQL;
  beforeEach(() => {
    db = new TestPostgreSQL();
    Database.getInstance = () => db;
    return db.initialize();
  });

  afterEach(() => {
    restoreTestDatabase();
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

    await db.cleanSaves(game.id, 3);
    const saveIds = await db.getSaveIds(game.id);
    expect(saveIds).has.members([0, 3]);
  });
});
