import {expect, use} from 'chai';
import chaiAsPromised = require('chai-as-promised');
use(chaiAsPromised);
import chaiDeepEqualIgnoreUndefined from 'chai-deep-equal-ignore-undefined';
use(chaiDeepEqualIgnoreUndefined);

import {ITestDatabase} from './ITestDatabase';
import {Game} from '../../src/server/Game';
import {TestPlayer} from '../TestPlayer';
import {restoreTestDatabase, setTestDatabase} from '../testing/setup';
import {testGame} from '../TestGame';
import {GameId} from '../../src/common/Types';
import {statusCode} from '../../src/common/http/statusCode';
import {cast} from '../TestingUtils';
import {SelectInitialCards} from '../../src/server/inputs/SelectInitialCards';
import {DiscordUser} from '../../src/server/server/auth/discord';

/**
 * Describes a database test
 */
export type DatabaseTestDescriptor<T extends ITestDatabase> = {
  name: string,
  constructor: () => T,
  stats: any,
  omit?: Partial<{
    purgeUnfinishedGames: boolean,
    markFinished: boolean,
    moreCleaning: boolean,
    sessions: boolean,
  }>,
  otherTests?(dbFactory: () => T): void,
};

export function describeDatabaseSuite<T extends ITestDatabase>(dtor: DatabaseTestDescriptor<T>) {
  describe(dtor.name, () => {
    let db: T;
    beforeEach(() => {
      db = dtor.constructor();
      setTestDatabase(db);
      return db.initialize();
    });

    afterEach(async () => {
      restoreTestDatabase();
      await db.afterEach?.();
    });

    it('game is saved', async () => {
      const player = TestPlayer.BLACK.newPlayer();
      Game.newInstance('game-id-1212', [player], player);
      await db.lastSaveGamePromise;
      const allGames = await db.getGameIds();
      expect(allGames).deep.eq(['game-id-1212']);
    });

    it('getGameIds - removes duplicates', async () => {
      const player = TestPlayer.BLACK.newPlayer();
      const game = Game.newInstance('game-id-1212', [player], player);
      cast(player.popWaitingFor(), SelectInitialCards);
      await db.lastSaveGamePromise;
      await db.saveGame(game);

      const allGames = await db.getGameIds();
      expect(allGames).deep.eq(['game-id-1212']);
    });

    it('getGameIds - includes finished games', async () => {
      const player = TestPlayer.BLACK.newPlayer();
      const game = Game.newInstance('game-id-1212', [player], player);
      cast(player.popWaitingFor(), SelectInitialCards);
      await db.lastSaveGamePromise;
      Game.newInstance('game-id-2323', [player], player);
      await db.lastSaveGamePromise;

      await db.markFinished(game.id);

      const allGameIds = await db.getGameIds();
      expect(allGameIds).has.members(['game-id-1212', 'game-id-2323']);
    });

    it('saveIds', async () => {
      const player = TestPlayer.BLACK.newPlayer();
      const game = Game.newInstance('game-id-1212', [player], player);
      await db.lastSaveGamePromise;
      expect(game.lastSaveId).eq(1);

      await db.saveGame(game);
      await db.saveGame(game);
      await db.saveGame(game);

      const allSaveIds = await db.getSaveIds(game.id);
      expect(allSaveIds).has.members([0, 1, 2, 3]);
    });

    if (dtor.omit?.markFinished !== true) {
      it('markFinished', async () => {
        const player = TestPlayer.BLACK.newPlayer();
        const game = Game.newInstance('game-id-1212', [player], player);
        await db.lastSaveGamePromise;
        await db.saveGame(game);
        await db.saveGame(game);
        await db.saveGame(game);

        expect(await db.getSaveIds(game.id)).has.members([0, 1, 2, 3]);
        expect(await db.status(game.id)).eq('running');

        await db.markFinished(game.id);

        expect(await db.status(game.id)).eq('finished');
        const saveIds = await db.getSaveIds(game.id);
        expect(saveIds).has.members([0, 1, 2, 3]);
        expect(await db.completedTime(game.id)).is.not.undefined;
      });

      if (dtor.omit?.moreCleaning !== true) {
        it('moreCleaning', async () => {
          async function createGame(id: GameId) {
            const player = TestPlayer.BLACK.newPlayer();
            const game = Game.newInstance(id, [player], player);
            await db.lastSaveGamePromise;
            await db.saveGame(game);
            await db.saveGame(game);
            await db.saveGame(game);

            expect(await db.status(game.id)).eq('running');

            await db.markFinished(game.id);

            expect(await db.status(game.id)).eq('finished');
          }

          // Create 2 finished games.
          await createGame('game1-id');
          await createGame('game2-id');

          expect(await db.getSaveIds('game1-id')).has.members([0, 1, 2, 3]);
          expect(await db.completedTime('game1-id')).is.not.undefined;

          expect(await db.getSaveIds('game2-id')).has.members([0, 1, 2, 3]);
          expect(await db.completedTime('game2-id')).is.not.undefined;

          await db.compressCompletedGames('2');

          expect(await db.getSaveIds('game1-id')).has.members([0, 1, 2, 3]);
          expect(await db.completedTime('game1-id')).is.not.undefined;

          expect(await db.getSaveIds('game2-id')).has.members([0, 1, 2, 3]);
          expect(await db.completedTime('game2-id')).is.not.undefined;

          await db.setCompletedTime('game2-id', 100);
          await db.compressCompletedGames('2');

          expect(await db.getSaveIds('game1-id')).has.members([0, 1, 2, 3]);
          expect(await db.completedTime('game1-id')).is.not.undefined;

          expect(await db.getSaveIds('game2-id')).has.members([0, 3]);
          expect(await db.completedTime('game2-id')).is.undefined;
        });
      }
    }

    it('gets player count', async () => {
      const player = TestPlayer.BLACK.newPlayer();
      const game = Game.newInstance('game-id-1212', [player], player);
      await db.lastSaveGamePromise;
      expect(game.lastSaveId).eq(1);

      expect(db.getPlayerCount(game.id)).become(1);
    });

    it('does not find player count by id', async () => {
      const player = TestPlayer.BLACK.newPlayer();
      const game = Game.newInstance('game-id-1212', [player], player);
      await db.lastSaveGamePromise;
      expect(game.lastSaveId).eq(1);

      expect(db.getPlayerCount('g-notfound')).is.rejected;
    });

    if (dtor.omit?.purgeUnfinishedGames !== true) {
      it('purgeUnfinishedGames', async () => {
        const player = TestPlayer.BLACK.newPlayer();
        const game = Game.newInstance('game-id-1212', [player], player);
        await db.lastSaveGamePromise;
        expect(game.lastSaveId).eq(1);

        await db.saveGame(game);
        await db.saveGame(game);
        await db.saveGame(game);

        expect(await db.getSaveIds(game.id)).has.members([0, 1, 2, 3]);

        await db.purgeUnfinishedGames('1');
        expect(await db.getSaveIds(game.id)).has.members([0, 1, 2, 3]);
        const entry = (await db.getParticipants()).find((entry) => entry.gameId === game.id);
        expect(entry?.participantIds).deep.eq([player.id]);
        // Doesn't purge until the time has passed.
        await db.purgeUnfinishedGames('-1');
        // await db.purgeUnfinishedGames('0'); This doesn't work! I wonder if it's just too precise a clock problem.
        expect(await db.getSaveIds(game.id)).is.empty;
        const postPurgeEntry = (await db.getParticipants()).find((entry) => entry.gameId === game.id);
        expect(postPurgeEntry).is.undefined;
      });
    }

    it('getGame', async () => {
      const player = TestPlayer.BLACK.newPlayer();
      const game = Game.newInstance('game-id-1212', [player], player, {underworldExpansion: true});
      await db.lastSaveGamePromise;
      expect(game.lastSaveId).eq(1);

      player.megaCredits = 200;
      game.log('databaseSuite.getGame test');

      const expected = game.serialize();
      await db.saveGame(game);

      const actual = await db.getGame(game.id);
      expect(actual.gameLog[actual.gameLog.length -1].message).eq('databaseSuite.getGame test');
      expect(actual.gameOptions.underworldExpansion).eq(true);
      expect(actual).deepEqualIgnoreUndefined(expected);
    });

    it('getGameVersion', async () => {
      const player = TestPlayer.BLACK.newPlayer();
      const game = Game.newInstance('game-id-1212', [player], player);
      await db.lastSaveGamePromise;
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
      expect(serialized1.players[0].megaCredits).eq(statusCode.ok);

      const serialized2 = await db.getGameVersion(game.id, 2);
      expect(serialized2.players[0].megaCredits).eq(300);

      const serialized3 = await db.getGameVersion(game.id, 3);
      expect(serialized3.players[0].megaCredits).eq(statusCode.badRequest);

      await expect(db.getGameVersion('game-id-123', 0)).to.be.rejectedWith(/Game game-id-123 not found/);
    });

    it('participantIds', async () => {
      expect(await db.getParticipants()).is.empty;
      testGame(2, {}, '1');
      await db.lastSaveGamePromise;
      expect(await db.getParticipants()).deep.eq([
        {
          'gameId': 'game-id1',
          'participantIds': [
            'p-player1-id1',
            'p-player2-id1',
            'spectator-id1',
          ],
        },
      ]);
      testGame(3, {}, '2');
      await db.lastSaveGamePromise;
      expect(await db.getParticipants()).deep.eq([
        {
          'gameId': 'game-id1',
          'participantIds': [
            'p-player1-id1',
            'p-player2-id1',
            'spectator-id1',
          ],
        },
        {
          'gameId': 'game-id2',
          'participantIds': [
            'p-player1-id2',
            'p-player2-id2',
            'p-player3-id2',
            'spectator-id2',
          ],
        },
      ]);
    });

    it('getGameId by PlayerID and Spectator ID', async () => {
      testGame(2, {}, '1');
      await db.lastSaveGamePromise;
      testGame(3, {}, '2');
      await db.lastSaveGamePromise;
      expect(await db.getGameId('p-player1-id1')).eq('game-id1');
      expect(await db.getGameId('p-player3-id2')).eq('game-id2');
      expect(db.getGameId('p-unknown')).to.be.rejected;

      expect(await db.getGameId('spectator-id1')).eq('game-id1');
      expect(await db.getGameId('spectator-id2')).eq('game-id2');
      expect(db.getGameId('spectator-unknown')).to.be.rejected;
    });

    it('deleteGameNbrSaves', async () => {
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

      await db.deleteGameNbrSaves(game.id, 2);

      const saveIds = await db.getSaveIds(game.id);
      expect(saveIds).has.members([0, 1, 2, 3]);
    });

    if (dtor.omit?.sessions !== true) {
      const discordUser = {id: 'xyz'} as DiscordUser;
      it('createSession', async () => {
        const expirationTimeMillis = Date.now() + 100000;
        await db.createSession({id: '123', expirationTimeMillis, data: {discordUser}});
        const sessions = await db.getSessions();
        expect(sessions).deep.eq([{id: '123', expirationTimeMillis, data: {discordUser}}]);
      });

      it('deleteSession', async () => {
        // TODO(kberg): Make databases rely on Clock. /shrug
        const expirationTimeMillis = Date.now() + 100000;
        await db.createSession({id: '123', expirationTimeMillis, data: {discordUser}});
        let sessions = await db.getSessions();
        expect(sessions).deep.eq([{id: '123', expirationTimeMillis, data: {discordUser}}]);
        await db.deleteSession('123');
        sessions = await db.getSessions();
        expect(sessions).to.be.empty;
      });

      it('expiredSession', async () => {
        const expirationTimeMillis = Date.now() - 1;
        await db.createSession({id: '123', expirationTimeMillis, data: {discordUser}});
        const sessions = await db.getSessions();
        expect(sessions).to.be.empty;
      });
    }

    it('stats', async () => {
      const result = await db.stats();
      expect(result).deep.eq(dtor.stats);
    });

    dtor.otherTests?.(() => db);
  });
}
