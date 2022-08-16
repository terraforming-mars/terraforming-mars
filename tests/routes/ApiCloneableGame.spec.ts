import {expect} from 'chai';
import {ApiCloneableGame} from '../../src/server/routes/ApiCloneableGame';
import {MockResponse} from './HttpMocks';
import {Database} from '../../src/server/database/Database';
import {RouteTestScaffolding} from './RouteTestScaffolding';
import {GameId} from '../../src/common/Types';

describe('ApiCloneableGame', () => {
  let scaffolding: RouteTestScaffolding;
  let res: MockResponse;
  let originalGetPlayerCount: (gameId: GameId) => Promise<number>;

  beforeEach(() => {
    scaffolding = new RouteTestScaffolding();
    res = new MockResponse();
    originalGetPlayerCount = Database.getInstance().getPlayerCount;
  });

  afterEach(() => {
    Database.getInstance().getPlayerCount = originalGetPlayerCount;
  });

  it('no parameter', async () => {
    scaffolding.url = '/api/cloneablegames';
    await scaffolding.get(ApiCloneableGame.INSTANCE, res);
    expect(res.statusCode).eq(400);
    expect(res.content).eq('Bad request: missing id parameter');
  });

  it('invalid id', async () => {
    scaffolding.url = '/api/cloneablegames?id=invalidId';
    await scaffolding.get(ApiCloneableGame.INSTANCE, res);
    expect(res.statusCode).eq(400);
    expect(res.content).eq('Bad request: invalid game id');
  });

  it('has error while loading', async () => {
    Database.getInstance().getPlayerCount = (_gameId) => {
      return new Promise((_resolve, reject) => {
        reject(new Error('Segmentation fault'));
      });
    };
    scaffolding.url = '/api/cloneablegames?id=gameIdInvalid';
    await scaffolding.get(ApiCloneableGame.INSTANCE, res);
    expect(res.statusCode).eq(404);
    expect(res.content).eq('Not found');
  });

  it('finds game', async () => {
    Database.getInstance().getPlayerCount = (_gameId) => Promise.resolve(2);
    scaffolding.url = '/api/cloneablegames?id=g456';
    await scaffolding.get(ApiCloneableGame.INSTANCE, res);
    expect(res.statusCode).eq(200);
    expect(res.content).eq(JSON.stringify({
      gameId: 'g456',
      playerCount: 2,
    }));
  });
});
