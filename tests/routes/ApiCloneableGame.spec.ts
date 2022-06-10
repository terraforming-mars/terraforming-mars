import {expect} from 'chai';
import {ApiCloneableGame} from '../../src/routes/ApiCloneableGame';
import {MockResponse} from './HttpMocks';
import {Database} from '../../src/database/Database';
import {RouteTestScaffolding} from './RouteTestScaffolding';

describe('ApiCloneableGame', () => {
  let scaffolding: RouteTestScaffolding;
  let res: MockResponse;
  let originalGetPlayerCount: (gameId: string) => Promise<number>;

  beforeEach(() => {
    scaffolding = new RouteTestScaffolding();
    res = new MockResponse();
    originalGetPlayerCount = Database.getInstance().getPlayerCount;
  });

  afterEach(() => {
    Database.getInstance().getPlayerCount = originalGetPlayerCount;
  });

  it('no parameter', () => {
    scaffolding.url = '/api/cloneablegames';
    scaffolding.get(ApiCloneableGame.INSTANCE, res);
    expect(res.statusCode).eq(400);
    expect(res.content).eq('Bad request: id parameter missing');
  });

  it('has error while loading', async () => {
    Database.getInstance().getPlayerCount = (_gameId) => {
      return new Promise((_resolve, reject) => {
        reject(new Error('Segmentation fault'));
      });
    };
    scaffolding.url = '/api/cloneablegames?id=invalidId';
    await scaffolding.asyncGet(ApiCloneableGame.INSTANCE, res);
    expect(res.statusCode).eq(404);
    expect(res.content).eq('Not found');
  });

  it('finds game', async () => {
    Database.getInstance().getPlayerCount = (_gameId) => Promise.resolve(2);
    scaffolding.url = '/api/cloneablegames?id=g456';
    await scaffolding.asyncGet(ApiCloneableGame.INSTANCE, res);
    expect(res.statusCode).eq(200);
    expect(res.content).eq(JSON.stringify({
      gameId: 'g456',
      playerCount: 2,
    }));
  });
});
