import {expect} from 'chai';
import {ApiGameHistory} from '../../src/server/routes/ApiGameHistory';
import {IDatabase} from '../../src/server/database/IDatabase';
import {GameId} from '../../src/common/Types';
import {MockResponse} from './HttpMocks';
import {RouteTestScaffolding} from './RouteTestScaffolding';
import {restoreTestDatabase, setTestDatabase} from '../testing/setup';

describe('ApiGameHistory', () => {
  let scaffolding: RouteTestScaffolding;
  let res: MockResponse;

  beforeEach(() => {
    scaffolding = new RouteTestScaffolding();
    res = new MockResponse();
  });

  afterEach(() => {
    restoreTestDatabase();
  });

  it('fails when id not provided', async () => {
    scaffolding.url = '/api/game/history?serverId=1';
    await scaffolding.get(ApiGameHistory.INSTANCE, res);
    expect(res.content).eq('Bad request: missing id parameter');
  });

  it('fails with invalid id', async () => {
    scaffolding.url = '/api/game/history?serverId=1&id=not-a-game-id';
    await scaffolding.get(ApiGameHistory.INSTANCE, res);
    expect(res.content).eq('Bad request: Invalid game id');
  });

  it('returns save ids in numeric order', async () => {
    // The database returns save ids in arbitrary order. Once a game has ten or
    // more saves, a stringwise sort would order them [0, 1, 10, 11, 2, ...], so
    // the route must sort numerically.
    setTestDatabase({
      getSaveIds: (_gameId: GameId) => Promise.resolve([10, 2, 0, 11, 1, 3]),
    } as Partial<IDatabase> as IDatabase);

    scaffolding.url = '/api/game/history?serverId=1&id=game-id';
    await scaffolding.get(ApiGameHistory.INSTANCE, res);

    expect(JSON.parse(res.content)).deep.eq([0, 1, 2, 3, 10, 11]);
  });
});
