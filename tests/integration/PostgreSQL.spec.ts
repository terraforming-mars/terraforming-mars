import * as dotenv from 'dotenv';
import {expect} from 'chai';
import {ITestDatabase, describeDatabaseSuite} from '../database/databaseSuite';
import {Game} from '../../src/server/Game';
import {PostgreSQL} from '../../src/server/database/PostgreSQL';
import {TestPlayer} from '../TestPlayer';
import {SelectOption} from '../../src/server/inputs/SelectOption';
import {Phase} from '../../src/common/Phase';
import {runAllActions, testGameOptions} from '../TestingUtils';
import {Player} from '../../src/server/Player';
import {GameLoader} from '../../src/server/database/GameLoader';

dotenv.config({path: 'tests/integration/.env', debug: true});

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
    response['size-bytes-participants'] = 'any';

    return response;
  }

  public async afterEach() {
    await this.client.query('DROP TABLE games');
    await this.client.query('DROP TABLE game_results');
    await this.client.query('DROP TABLE participants');
  }

  public getStatistics() {
    return this.statistics;
  }

  public async awaitAllSaves() {
    await Promise.all(this.promises);
    this.promises.length = 0;
  }
  public async getStat(field: string): Promise<string | number> {
    return (await this.stats())[field];
  }
}

describeDatabaseSuite({
  name: 'PostgreSQL',
  constructor: () => new TestPostgreSQL(),
  omit: {
    purgeUnfinishedGames: true,
  },
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
    'size-bytes-participants': 'any',
  },

  otherTests: (dbFunction: () => ITestDatabase) => {
    it('saveGame with the same saveID', async () => {
      const db = dbFunction() as TestPostgreSQL;
      const player = TestPlayer.BLACK.newPlayer();
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

    // When sqlite does the same thing this can go into the suite.
    it('getGames - returns in order of last saved', async () => {
      const db = dbFunction() as TestPostgreSQL;
      const player = TestPlayer.BLACK.newPlayer();
      const game1 = Game.newInstance('game-id-1111', [player], player);
      await db.lastSaveGamePromise;
      const game2 = Game.newInstance('game-id-2222', [player], player);
      await db.lastSaveGamePromise;
      const game3 = Game.newInstance('game-id-3333', [player], player);
      await db.lastSaveGamePromise;

      expect(await db.getGameIds()).deep.eq(['game-id-3333', 'game-id-2222', 'game-id-1111']);

      game1.save();
      await db.lastSaveGamePromise;

      expect(await db.getGameIds()).deep.eq(['game-id-1111', 'game-id-3333', 'game-id-2222']);

      game2.save();
      await db.lastSaveGamePromise;

      expect(await db.getGameIds()).deep.eq(['game-id-2222', 'game-id-1111', 'game-id-3333']);

      game3.save();
      await db.lastSaveGamePromise;

      expect(await db.getGameIds()).deep.eq(['game-id-3333', 'game-id-2222', 'game-id-1111']);
    });

    it('test save id count with undo', async () => {
      // Set up a simple game.
      const db = dbFunction() as TestPostgreSQL;
      const player = TestPlayer.BLACK.newPlayer(/** beginner */ true);
      const player2 = TestPlayer.RED.newPlayer(/** beginner */ true);
      const game = Game.newInstance('gameid', [player, player2], player, testGameOptions({draftVariant: false, undoOption: true}));
      await db.awaitAllSaves();

      expect(await db.getStat('save-count')).eq(1);
      expect(await db.getSaveIds(game.id)).deep.eq([0]);

      // Move into the action phase by having both players complete their research.
      // This triggers another save.
      game.playerIsFinishedWithResearchPhase(player);
      game.playerIsFinishedWithResearchPhase(player2);
      expect(game.phase).eq(Phase.ACTION);

      await db.awaitAllSaves();
      expect(await db.getStat('save-count')).eq(2);
      expect(await db.getSaveIds(game.id)).deep.eq([0, 1]);

      // Player.takeAction sets waitingFor and waitingForCb. This overrides it
      // with our own simple option, and then mimics the waitingForCb behavior at
      // the end of Player.takeAction
      function takeAction(p: Player) {
        // A do-nothing player input
        const simpleOption = new SelectOption('', '', () => undefined);
        p.setWaitingFor(simpleOption, () => {
          (p as any).incrementActionsTaken();
          p.takeAction();
        });
      }

      // Player's first action
      expect(game.activePlayer).eq(player.id);
      expect(player.actionsTakenThisRound).eq(0);

      // Taking an action triggers a save (when undo is enabled.)
      takeAction(player);
      player.process([]);
      await db.awaitAllSaves();

      expect(await db.getStat('save-count')).eq(3);
      expect(await db.getSaveIds(game.id)).deep.eq([0, 1, 2]);
      // This stat reports whether a game with undo enabled updates instead of inserts.
      // None are expected at this point.
      expect(await db.getStat('save-confict-undo-count')).eq(0);

      // Player's second action
      expect(game.activePlayer).eq(player.id);
      expect(player.actionsTakenThisRound).eq(1);

      takeAction(player);
      player.process([]);
      await db.awaitAllSaves();

      // It is now the second player's turn. This test doesn't care about what the
      // second player does, but it is just a cue that the server has done a few things.
      // This test cares about the database things it does.
      expect(game.activePlayer).eq(player2.id);
      expect(player.actionsTakenThisRound).eq(0);

      // Notice how save-count was 3 and is now 5. It saved twice.
      expect(await db.getStat('save-count')).eq(5);
      // If save count is 5, why are only four versions saved?
      expect(await db.getSaveIds(game.id)).deep.eq([0, 1, 2, 3]);
      // That's because one of those saves was an update instead of an insert.
      // Version 3 was saved twice.
      expect(await db.getStat('save-confict-undo-count')).eq(1);

      // Of all the steps in this test, this is the one which will verify the broken undo
      // is repaired correctly. When it was broken, this was 5.
      expect(game.lastSaveId).eq(4);
    });

    it('undo works in multiplayer, other players have passed', async () => {
      const db = dbFunction() as TestPostgreSQL;
      const player = TestPlayer.BLACK.newPlayer(/** beginner */ true);
      const player2 = TestPlayer.RED.newPlayer(/** beginner */ true);
      const game = Game.newInstance('gameid', [player, player2], player2, testGameOptions({draftVariant: false, undoOption: true}));
      await db.awaitAllSaves();

      // Move into the action phase by having both players complete their research.
      // This triggers another save.
      game.playerIsFinishedWithResearchPhase(player);
      game.playerIsFinishedWithResearchPhase(player2);
      runAllActions(game);
      expect(game.phase).eq(Phase.ACTION);
      expect(game.activePlayer).eq(player2.id);

      await db.awaitAllSaves();

      player2.pass();
      game.playerIsFinishedTakingActions();
      runAllActions(game);
      expect(game.activePlayer).eq(player.id);

      // Player.takeAction sets waitingFor and waitingForCb. This overrides it
      // with a custom option (gain one mc), and then mimics the waitingForCb behavior at
      // the end of Player.takeAction
      function takeAction(p: Player) {
        // A do-nothing player input
        const simpleOption = new SelectOption('', '', () => {
          player.megaCredits++;
          return undefined;
        });
        p.setWaitingFor(simpleOption, () => {
          (p as any).incrementActionsTaken();
          p.takeAction();
        });
      }

      expect(game.activePlayer).eq(player.id);
      expect(player.actionsTakenThisRound).eq(0);

      takeAction(player);
      player.process([]);
      await db.awaitAllSaves();
      expect(player.megaCredits).eq(1);
      expect(player.actionsTakenThisRound).eq(1);

      // Player's second action
      takeAction(player);
      player.process([]);
      await db.awaitAllSaves();
      expect(player.megaCredits).eq(2);
      expect(player.actionsTakenThisRound).eq(2);


      // Player's third action
      takeAction(player);
      player.process([]);
      await db.awaitAllSaves();
      expect(player.megaCredits).eq(3);
      expect(player.actionsTakenThisRound).eq(3);


      // Player's fourth action
      takeAction(player);
      player.process([]);
      await db.awaitAllSaves();
      expect(player.megaCredits).eq(4);
      expect(player.actionsTakenThisRound).eq(4);


      // Player's fifth action
      takeAction(player);
      player.process([]);
      await db.awaitAllSaves();
      expect(player.megaCredits).eq(5);
      expect(player.actionsTakenThisRound).eq(5);

      // Trigger an undo
      // This is embedded in routes/PlayerInput, and should be moved out of there.
      const lastSaveId = game.lastSaveId - 2;
      const newGame = await GameLoader.getInstance().restoreGameAt(player.game.id, lastSaveId);
      await db.awaitAllSaves();
      const revisedPlayer = newGame.getPlayerById(player.id);
      expect(revisedPlayer.megaCredits).eq(4);
      expect(revisedPlayer.actionsTakenThisRound).eq(4);
    });

    it('undo works in solo', async () => {
      const db = dbFunction() as TestPostgreSQL;
      const player = TestPlayer.BLACK.newPlayer(/** beginner */ true);
      const game = Game.newInstance('gameid', [player], player, testGameOptions({undoOption: true}));
      await db.awaitAllSaves();

      // Move into the action phase. This triggers a save.
      game.playerIsFinishedWithResearchPhase(player);
      expect(game.phase).eq(Phase.ACTION);
      await db.awaitAllSaves();

      // Player.takeAction sets waitingFor and waitingForCb. This overrides it
      // with a custom option (gain one mc), and then mimics the waitingForCb behavior at
      // the end of Player.takeAction
      function takeAction(p: Player) {
        // A do-nothing player input
        const simpleOption = new SelectOption('', '', () => {
          player.megaCredits++;
          return undefined;
        });
        p.setWaitingFor(simpleOption, () => {
          (p as any).incrementActionsTaken();
          p.takeAction();
        });
      }

      expect(game.activePlayer).eq(player.id);
      expect(player.actionsTakenThisRound).eq(0);

      takeAction(player);
      player.process([]);
      await db.awaitAllSaves();
      expect(player.megaCredits).eq(1);
      expect(player.actionsTakenThisRound).eq(1);

      // Player's second action
      takeAction(player);
      player.process([]);
      await db.awaitAllSaves();
      expect(player.megaCredits).eq(2);
      expect(player.actionsTakenThisRound).eq(2);


      // Player's third action
      takeAction(player);
      player.process([]);
      await db.awaitAllSaves();
      expect(player.megaCredits).eq(3);
      expect(player.actionsTakenThisRound).eq(3);


      // Player's fourth action
      takeAction(player);
      player.process([]);
      await db.awaitAllSaves();
      expect(player.megaCredits).eq(4);
      expect(player.actionsTakenThisRound).eq(4);


      // Player's fifth action
      takeAction(player);
      player.process([]);
      await db.awaitAllSaves();
      expect(player.megaCredits).eq(5);
      expect(player.actionsTakenThisRound).eq(5);

      // Trigger an undo
      // This is embedded in routes/PlayerInput, and should be moved out of there.
      const lastSaveId = game.lastSaveId - 2;
      const newGame = await GameLoader.getInstance().restoreGameAt(player.game.id, lastSaveId);
      await db.awaitAllSaves();
      const revisedPlayer = newGame.getPlayerById(player.id);
      expect(revisedPlayer.megaCredits).eq(4);
      expect(revisedPlayer.actionsTakenThisRound).eq(4);
    });
  },
});
