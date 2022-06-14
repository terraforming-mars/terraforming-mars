import {use, expect} from 'chai';
import chaiAsPromised = require('chai-as-promised');
use(chaiAsPromised);

import {Game} from '../../src/Game';
import {TestPlayers} from '../TestPlayers';
import {IN_MEMORY_SQLITE_PATH, SQLite} from '../../src/database/SQLite';
import {restoreTestDatabase, setTestDatabase} from '../utils/setup';
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
}

describe('SQLite', () => {
  let db: TestSQLite;
  beforeEach(() => {
    db = new TestSQLite();
    setTestDatabase(db);
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

  it('stats', async () => {
    const stats = await db.stats();
    expect(stats).deep.eq({
      type: 'SQLite',
      path: ':memory:',
      size_bytes: -1,
    });
  });
});
