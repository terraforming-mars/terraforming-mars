import {describeDatabaseSuite} from '../database/databaseSuite';
import {ITestDatabase, Status} from '../database/ITestDatabase';
import {InMemoryDatabase} from './InMemoryDatabase';
import {IGame} from '../../src/server/IGame';
import {GameId} from '../../src/common/Types';

class TestInMemoryDatabase extends InMemoryDatabase implements ITestDatabase {
  public lastSaveGamePromise: Promise<void> = Promise.resolve();

  constructor() {
    super();
  }

  public override saveGame(game: IGame): Promise<void> {
    this.lastSaveGamePromise = super.saveGame(game);
    return this.lastSaveGamePromise;
  }

  status(gameId: GameId): Promise<Status> {
    if (this.completedGames.has(gameId)) {
      return Promise.resolve('finished');
    } else if (this.games.has(gameId)) {
      return Promise.resolve('running');
    }
    throw new Error('Unknown status for ' + gameId);
  }
  completedTime(gameId: GameId): Promise<number | undefined> {
    return Promise.resolve(this.completedGames.get(gameId)?.getTime());
  }
  setCompletedTime(gameId: GameId, timestampSeconds: number): Promise<unknown> {
    this.completedGames.set(gameId, new Date(timestampSeconds * 1000));
    return Promise.resolve();
  }
}

describeDatabaseSuite({
  name: 'InMemoryDatabase',
  constructor: () => new TestInMemoryDatabase(),
  omit: {
    purgeUnfinishedGames: true,
    moreCleaning: true,
  },
  stats: {
    type: 'InMemoryDatabase',
  },
});
