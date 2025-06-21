import * as dotenv from 'dotenv';
import {expect} from 'chai';
import {describeDatabaseSuite} from '../database/databaseSuite';
import {ITestDatabase, Status} from '../database/ITestDatabase';
import {IGame} from '../../src/server/IGame';
import {Game} from '../../src/server/Game';
import {PostgreSQL, POSTGRESQL_TABLES} from '../../src/server/database/PostgreSQL';
import {TestPlayer} from '../TestPlayer';
import {SelectOption} from '../../src/server/inputs/SelectOption';
import {Phase} from '../../src/common/Phase';
import {cast, runAllActions} from '../TestingUtils';
import {IPlayer} from '../../src/server/IPlayer';
import {GameLoader} from '../../src/server/database/GameLoader';
import {GameId} from '../../src/common/Types';
import {QueryResult} from 'pg';
import {SelectInitialCards} from '../../src/server/inputs/SelectInitialCards';
import {range} from '../../src/common/utils/utils';

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
  public override async saveGame(game: IGame): Promise<void> {
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

    const extraFields = ['rows-game', 'size-bytes-game', 'rows-completed-game', 'size-bytes-completed-game', 'rows-session', 'size-bytes-session'];
    for (const field of extraFields) {
      expect(response[field], 'For ' + field).is.not.undefined;
      delete response[field];
    }
    return response;
  }

  public setTrimCount(trimCount: number) {
    this.trimCount = trimCount;
  }

  public async afterEach() {
    for (const table of POSTGRESQL_TABLES) {
      await this.client.query('DROP TABLE IF EXISTS ' + table);
    }
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

  async status(gameId: GameId): Promise<Status> {
    const result = await this.client.query('SELECT DISTINCT status FROM games WHERE game_id = $1 LIMIT 1', [gameId]);
    const statusText = result.rows[0].status;
    if (statusText === 'running' || statusText === 'finished') {
      return statusText;
    }
    throw new Error('Invalid status for ' + gameId + ': ' + statusText);
  }

  async completedTime(gameId: GameId): Promise<number | undefined> {
    const res = await this.client.query('SELECT completed_time FROM completed_game WHERE game_id = $1', [gameId]);
    if (res.rows.length === 0 || res.rows[0] === undefined) {
      return undefined;
    }
    const row = res.rows[0];
    return row.completed_time;
  }

  setCompletedTime(gameId: GameId, timestampSeconds: number): Promise<QueryResult<any>> {
    return this.client.query('UPDATE completed_game SET completed_time = to_timestamp($1) WHERE game_id = $2', [timestampSeconds, gameId]);
  }
}

describeDatabaseSuite({
  name: 'PostgreSQL',
  constructor: () => new TestPostgreSQL(),
  omit: {
    purgeUnfinishedGames: true,
    markFinished: true,
  },
  stats: {
    'type': 'POSTGRESQL',
    'pool-total-count': 1,
    'pool-idle-count': 1,
    'pool-waiting-count': 0,
    'rows-game-results': '0',
    'rows-games': '0',
    'rows-participants': '0',
    'size-bytes-games': 'any',
    'size-bytes-game-results': 'any',
    'size-bytes-database': 'any',
    'save-conflict-normal-count': 0,
    'save-conflict-undo-count': 0,
    'save-count': 0,
    'save-error-count': 0,
    'size-bytes-participants': 'any',
  },

  otherTests: (dbFactory: () => TestPostgreSQL) => {
    it('saveGame with the same saveID', async () => {
      const db = dbFactory();
      const player = TestPlayer.BLACK.newPlayer();
      const game = Game.newInstance('game-id-1212', [player], player);
      cast(player.popWaitingFor(), SelectInitialCards);
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
      const db = dbFactory();
      const player = TestPlayer.BLACK.newPlayer();
      const game1 = Game.newInstance('game-id-1111', [player], player);
      await db.lastSaveGamePromise;
      const player2 = TestPlayer.RED.newPlayer();
      const game2 = Game.newInstance('game-id-2222', [player2], player2);
      await db.lastSaveGamePromise;
      const player3 = TestPlayer.BLUE.newPlayer();
      const game3 = Game.newInstance('game-id-3333', [player3], player3);
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
      const db = dbFactory();
      const player = TestPlayer.BLACK.newPlayer();
      const player2 = TestPlayer.RED.newPlayer();
      const game = Game.newInstance('gameid', [player, player2], player, {draftVariant: false, undoOption: true});

      await db.awaitAllSaves();

      expect(await db.getStat('save-count')).eq(1);
      expect(await db.getSaveIds(game.id)).deep.eq([0]);

      // Move into the action phase by having both players complete their research.
      // This triggers another save.
      expect(game.phase).eq(Phase.RESEARCH);
      game.playerIsFinishedWithResearchPhase(player);
      game.playerIsFinishedWithResearchPhase(player2);
      expect(game.phase).eq(Phase.ACTION);

      await db.awaitAllSaves();
      expect(await db.getStat('save-count')).eq(2);
      expect(await db.getSaveIds(game.id)).deep.eq([0, 1]);

      // Player.takeAction sets waitingFor and waitingForCb. This overrides it
      // with our own simple option, and then mimics the waitingForCb behavior at
      // the end of Player.takeAction
      function takeAction(p: IPlayer) {
        // A do-nothing player input
        const simpleOption = new SelectOption('');
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
      player.process({type: 'option'});
      await db.awaitAllSaves();

      expect(await db.getStat('save-count')).eq(3);
      expect(await db.getSaveIds(game.id)).deep.eq([0, 1, 2]);
      // This stat reports whether a game with undo enabled updates instead of inserts.
      // None are expected at this point.
      expect(await db.getStat('save-conflict-undo-count')).eq(0);

      // Player's second action
      expect(game.activePlayer).eq(player.id);
      expect(player.actionsTakenThisRound).eq(1);

      takeAction(player);
      player.process({type: 'option'});

      await db.awaitAllSaves();

      // It is now the second player's turn. This test doesn't care about what the
      // second player does, but it is just a cue that the server has done a few things.
      // This test cares about the database things it does.
      expect(game.activePlayer).eq(player2.id);
      expect(player.actionsTakenThisRound).eq(0);

      // Notice how save-count was 3 and is now 5. It saved twice.
      expect(await db.getStat('save-count')).eq(5);
      expect(await db.getSaveIds(game.id)).deep.eq([0, 1, 2, 3, 4]);
      expect(await db.getStat('save-conflict-undo-count')).eq(0);

      // Of all the steps in this test, this is the one which will verify the broken undo
      // is repaired correctly. When it was broken, this was 5.
      expect(game.lastSaveId).eq(5);
    });

    it('undo works in multiplayer, other players have passed', async () => {
      const db = dbFactory();
      const player = TestPlayer.BLACK.newPlayer();
      const player2 = TestPlayer.RED.newPlayer();
      const game = Game.newInstance('gameid', [player, player2], player2, {draftVariant: false, undoOption: true});
      // Adding to the GameLoader because this is manually managed by the Game route, which is the real place responsible for
      // creating new games.
      GameLoader.getInstance().add(game);
      await db.awaitAllSaves();

      expect(game.phase).eq(Phase.RESEARCH);
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
      function takeAction(p: IPlayer) {
        // A do-nothing player input
        const simpleOption = new SelectOption('').andThen(() => {
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
      player.process({type: 'option'});

      await db.awaitAllSaves();
      expect(player.megaCredits).eq(1);
      expect(player.actionsTakenThisRound).eq(1);

      // Player's second action
      takeAction(player);
      player.process({type: 'option'});

      await db.awaitAllSaves();
      expect(player.megaCredits).eq(2);
      expect(player.actionsTakenThisRound).eq(2);


      // Player's third action
      takeAction(player);
      player.process({type: 'option'});

      await db.awaitAllSaves();
      expect(player.megaCredits).eq(3);
      expect(player.actionsTakenThisRound).eq(3);


      // Player's fourth action
      takeAction(player);
      player.process({type: 'option'});

      await db.awaitAllSaves();
      expect(player.megaCredits).eq(4);
      expect(player.actionsTakenThisRound).eq(4);


      // Player's fifth action
      takeAction(player);
      player.process({type: 'option'});

      await db.awaitAllSaves();
      expect(player.megaCredits).eq(5);
      expect(player.actionsTakenThisRound).eq(5);

      // Trigger an undo
      // This is embedded in routes/PlayerInput, and should be moved out of there.
      const restorePoint = game.lastSaveId - 2;
      const gameLoader = GameLoader.getInstance();
      const newGame = await gameLoader.restoreGameAt(player.game.id, restorePoint);
      await db.awaitAllSaves();
      const revisedPlayer = newGame.getPlayerById(player.id);
      expect(revisedPlayer.megaCredits).eq(4);
      expect(revisedPlayer.actionsTakenThisRound).eq(4);
    });

    it('undo works in solo', async () => {
      const db = dbFactory();
      const player = TestPlayer.BLACK.newPlayer();
      const game = Game.newInstance('gameid', [player], player, {undoOption: true});
      await db.awaitAllSaves();

      // Move into the action phase. This triggers a save.
      game.playerIsFinishedWithResearchPhase(player);
      expect(game.phase).eq(Phase.ACTION);
      await db.awaitAllSaves();

      // Player.takeAction sets waitingFor and waitingForCb. This overrides it%
      // with a custom option (gain one mc), and then mimics the waitingForCb behavior at
      // the end of Player.takeAction
      function takeAction(p: IPlayer) {
        // A do-nothing player input
        const simpleOption = new SelectOption('').andThen(() => {
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
      player.process({type: 'option'});

      await db.awaitAllSaves();
      expect(player.megaCredits).eq(1);
      expect(player.actionsTakenThisRound).eq(1);

      // Player's second action
      takeAction(player);
      player.process({type: 'option'});

      await db.awaitAllSaves();
      expect(player.megaCredits).eq(2);
      expect(player.actionsTakenThisRound).eq(2);


      // Player's third action
      takeAction(player);
      player.process({type: 'option'});

      await db.awaitAllSaves();
      expect(player.megaCredits).eq(3);
      expect(player.actionsTakenThisRound).eq(3);


      // Player's fourth action
      takeAction(player);
      player.process({type: 'option'});

      await db.awaitAllSaves();
      expect(player.megaCredits).eq(4);
      expect(player.actionsTakenThisRound).eq(4);


      // Player's fifth action
      takeAction(player);
      player.process({type: 'option'});

      await db.awaitAllSaves();
      expect(player.megaCredits).eq(5);
      expect(player.actionsTakenThisRound).eq(5);

      // Trigger an undo
      // This is embedded in routes/PlayerInput, and should be moved out of there.
      const restorePoint = game.lastSaveId - 2;
      expect(restorePoint).eq(5);
      expect(game.lastSaveId).eq(7);
      const newGame = await GameLoader.getInstance().restoreGameAt(player.game.id, restorePoint);
      await db.awaitAllSaves();
      const revisedPlayer = newGame.getPlayerById(player.id);
      expect(revisedPlayer.megaCredits).eq(4);
      expect(revisedPlayer.actionsTakenThisRound).eq(4);
    });

    it('trim', async () => {
      const db = dbFactory();

      const player = TestPlayer.BLACK.newPlayer();
      const game = Game.newInstance('game-id-1212', [player], player);
      await db.lastSaveGamePromise;
      expect(game.lastSaveId).eq(1);

      await db.saveGame(game);
      await db.saveGame(game);
      await db.saveGame(game);
      await db.saveGame(game);
      await db.saveGame(game);

      expect(await db.getSaveIds(game.id)).has.members([0, 1, 2, 3, 4, 5]);

      await db.saveGame(game);
      await db.saveGame(game);
      await db.saveGame(game);
      await db.saveGame(game);
      await db.saveGame(game);

      expect(await db.getSaveIds(game.id)).has.members([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

      await db.saveGame(game);
      await db.saveGame(game);
      await db.saveGame(game);
      await db.saveGame(game);
      await db.saveGame(game);

      expect(await db.getSaveIds(game.id)).has.members([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);

      await db.saveGame(game);
      await db.saveGame(game);
      await db.saveGame(game);
      await db.saveGame(game);

      expect(await db.getSaveIds(game.id)).has.members([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);

      await db.saveGame(game);

      expect(await db.getSaveIds(game.id)).has.members([0, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);

      await db.saveGame(game);
      await db.saveGame(game);
      await db.saveGame(game);
      await db.saveGame(game);
      await db.saveGame(game);

      expect(await db.getSaveIds(game.id)).has.members([0, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]);

      await db.saveGame(game);
      await db.saveGame(game);
      await db.saveGame(game);
      await db.saveGame(game);

      expect(await db.getSaveIds(game.id)).has.members([0, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29]);

      await db.saveGame(game);

      expect(await db.getSaveIds(game.id)).has.members([0, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]);
    });

    it('trim at 5', async () => {
      const db = dbFactory();
      db.setTrimCount(5);

      const player = TestPlayer.BLACK.newPlayer();
      const game = Game.newInstance('game-id-1212', [player], player);
      await db.lastSaveGamePromise;
      expect(game.lastSaveId).eq(1);

      await db.saveGame(game);
      await db.saveGame(game);
      await db.saveGame(game);
      await db.saveGame(game);

      expect(await db.getSaveIds(game.id)).has.members([0, 1, 2, 3, 4]);

      await db.saveGame(game);

      expect(await db.getSaveIds(game.id)).has.members([0, 1, 2, 3, 4, 5]);

      await db.saveGame(game);
      await db.saveGame(game);
      await db.saveGame(game);
      await db.saveGame(game);

      expect(await db.getSaveIds(game.id)).has.members([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

      await db.saveGame(game);

      expect(await db.getSaveIds(game.id)).has.members([0, 5, 6, 7, 8, 9, 10]);
    });

    it('trim at 2', async () => {
      const db = dbFactory();
      db.setTrimCount(2);

      const player = TestPlayer.BLACK.newPlayer();
      const game = Game.newInstance('game-id-1212', [player], player);
      await db.lastSaveGamePromise;
      expect(game.lastSaveId).eq(1);

      expect(await db.getSaveIds(game.id)).has.members(range(1));

      await db.saveGame(game);
      expect(await db.getSaveIds(game.id)).has.members(range(2));

      await db.saveGame(game);
      expect(await db.getSaveIds(game.id)).has.members(range(3));

      await db.saveGame(game);
      expect(await db.getSaveIds(game.id)).has.members(range(4));

      await db.saveGame(game);
      expect(await db.getSaveIds(game.id)).has.members([0, 2, 3, 4]);

      await db.saveGame(game);
      expect(await db.getSaveIds(game.id)).has.members([0, 2, 3, 4, 5]);

      await db.saveGame(game);
      expect(await db.getSaveIds(game.id)).has.members([0, 4, 5, 6]);
    });

    it('trim at 0', async () => {
      const db = dbFactory();
      db.setTrimCount(0);

      const player = TestPlayer.BLACK.newPlayer();
      const game = Game.newInstance('game-id-1212', [player], player);
      await db.lastSaveGamePromise;
      expect(game.lastSaveId).eq(1);

      expect(await db.getSaveIds(game.id)).has.members(range(1));

      await db.saveGame(game);
      expect(await db.getSaveIds(game.id)).has.members(range(2));

      await db.saveGame(game);
      expect(await db.getSaveIds(game.id)).has.members(range(3));

      await db.saveGame(game);
      expect(await db.getSaveIds(game.id)).has.members(range(4));

      await db.saveGame(game);
      expect(await db.getSaveIds(game.id)).has.members(range(5));

      await db.saveGame(game);
      expect(await db.getSaveIds(game.id)).has.members(range(6));

      await db.saveGame(game);
      expect(await db.getSaveIds(game.id)).has.members(range(7));

      await db.saveGame(game);
      expect(await db.getSaveIds(game.id)).has.members(range(8));

      await db.saveGame(game);
      expect(await db.getSaveIds(game.id)).has.members(range(9));

      await db.saveGame(game);
      expect(await db.getSaveIds(game.id)).has.members(range(10));

      await db.saveGame(game);
      expect(await db.getSaveIds(game.id)).has.members(range(11));

      await db.saveGame(game);
      expect(await db.getSaveIds(game.id)).has.members(range(12));

      await db.saveGame(game);
      expect(await db.getSaveIds(game.id)).has.members(range(13));

      await db.saveGame(game);
      expect(await db.getSaveIds(game.id)).has.members(range(14));

      await db.saveGame(game);
      expect(await db.getSaveIds(game.id)).has.members(range(15));

      await db.saveGame(game);
      expect(await db.getSaveIds(game.id)).has.members(range(16));

      await db.saveGame(game);
      expect(await db.getSaveIds(game.id)).has.members(range(17));

      await db.saveGame(game);
      expect(await db.getSaveIds(game.id)).has.members(range(18));

      await db.saveGame(game);
      expect(await db.getSaveIds(game.id)).has.members(range(19));

      await db.saveGame(game);
      expect(await db.getSaveIds(game.id)).has.members(range(20));
    });

    it('trim at -1', async () => {
      const db = dbFactory();
      db.setTrimCount(-1);

      const player = TestPlayer.BLACK.newPlayer();
      const game = Game.newInstance('game-id-1212', [player], player);
      await db.lastSaveGamePromise;
      expect(game.lastSaveId).eq(1);

      expect(await db.getSaveIds(game.id)).has.members(range(1));

      await db.saveGame(game);
      expect(await db.getSaveIds(game.id)).has.members(range(2));

      await db.saveGame(game);
      expect(await db.getSaveIds(game.id)).has.members(range(3));
    });
  },
});
