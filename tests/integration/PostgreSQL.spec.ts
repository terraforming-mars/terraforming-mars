require('dotenv').config();
import {expect} from 'chai';
import {ITestDatabase, describeDatabaseSuite} from '../database/IDatabaseSuite';
import {Game} from '../../src/Game';
import {PostgreSQL} from '../../src/database/PostgreSQL';
import {TestPlayers} from '../TestPlayers';
import {SelectOption} from '../../src/inputs/SelectOption';
import {Phase} from '../../src/common/Phase';
import {setCustomGameOptions} from '../TestingUtils';
import {Player} from '../../src/Player';

/*
 * This test can be run with `npm run test:integration` as long as the test is set up
 * correctly.
 */
class TestPostgreSQL extends PostgreSQL implements ITestDatabase {
  public lastSaveGamePromise: Promise<void> = Promise.resolve();
  public readonly promises: Array<Promise<void>> = [];

  constructor() {
    super({
      user: 'tfmtest',
      database: 'tfmtest',
      host: 'localhost',
      password: process.env.POSTGRES_INTEGRATION_TEST_PASSWORD,
    });
  }

  // Tests can wait for saveGamePromise since save() is called inside other methods.
  public override async saveGame(game: Game): Promise<void> {
    this.lastSaveGamePromise = super.saveGame(game);
    this.promises.push(this.lastSaveGamePromise);
    return this.lastSaveGamePromise;
  }

  public override async stats(): Promise<{[key: string]: string | number}> {
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
      await db.lastSaveGamePromise;

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

    it('test save id count with undo', async () => {
      async function awaitAllSaves() {
        await Promise.all(db.promises);
        db.promises.length = 0;
      }

      const db = dbFunction() as TestPostgreSQL;
      const player = TestPlayers.BLACK.newPlayer(/** beginner */ true);
      const player2 = TestPlayers.RED.newPlayer(/** beginner */ true);
      const game = Game.newInstance('gameid', [player, player2], player, setCustomGameOptions({draftVariant: false, undoOption: true}));
      await awaitAllSaves();

      async function getStat(field: string): Promise<string | number> {
        return (await db.stats())[field];
      }
      expect(await getStat('save-count')).eq(1);
      expect(await db.getSaveIds(game.id)).deep.eq([0]);

      game.playerIsFinishedWithResearchPhase(player);
      game.playerIsFinishedWithResearchPhase(player2);
      expect(game.phase).eq(Phase.ACTION);

      await awaitAllSaves();
      expect(await getStat('save-count')).eq(2);
      expect(await db.getSaveIds(game.id)).deep.eq([0, 1]);

      // Creating a very simple waitingFor that does nothing.
      const simpleOption = new SelectOption('', '', () => undefined);

      function takeAction(p: Player) {
        // Player.takeAction sets waitingFor and waitingForCb. This overrides it
        // with our own simple option, and then mimics the waitingForCb behavior at
        // the end of Player.takeAction
        p.setWaitingFor(simpleOption, () => {
          (p as any).incrementActionsTaken();
          p.takeAction();
        });
      }

      expect(game.activePlayer).eq(player.id);
      expect(player.actionsTakenThisRound).eq(0);

      // Player's first action
      takeAction(player);
      player.process([]);
      await awaitAllSaves();

      expect(await getStat('save-count')).eq(3);
      expect(await db.getSaveIds(game.id)).deep.eq([0, 1, 2]);
      expect(game.activePlayer).eq(player.id);
      expect(player.actionsTakenThisRound).eq(1);

      // This stat reports whether a game with undo enabled updates instead of inserts.
      expect(await getStat('save-confict-undo-count')).eq(0);

      // Player's second action
      takeAction(player);
      player.process([]);
      await awaitAllSaves();

      // Notice how save-count went from 3 to 5. It saved twice.
      expect(await getStat('save-count')).eq(5);
      // That's because one of them is an update instead of an insert.
      expect(await getStat('save-confict-undo-count')).eq(1);

      expect(await db.getSaveIds(game.id)).deep.eq([0, 1, 2, 3]);
      expect(game.activePlayer).eq(player2.id);
      expect(player.actionsTakenThisRound).eq(0);

      // Of all the steps in this test, this is the one which will verify the broken undo
      // is repaired correctly. When it was broken, this was 5.
      expect(game.lastSaveId).eq(4);
    });
  },
});
