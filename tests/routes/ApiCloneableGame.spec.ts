import {expect} from 'chai';
import {ApiCloneableGame} from '../../src/routes/ApiCloneableGame';
import {MockResponse} from './HttpMocks';
import {Database} from '../../src/database/Database';
import {RouteTestScaffolding} from './RouteTestScaffolding';

describe('ApiCloneableGame', () => {
  let scaffolding: RouteTestScaffolding;
  let res: MockResponse;
  const origgetPlayerCount = Database.getInstance().getPlayerCount;

  beforeEach(() => {
    scaffolding = new RouteTestScaffolding();
    res = new MockResponse();
  });

  afterEach(() => {
    Database.getInstance().getPlayerCount = origgetPlayerCount;
  });

  it('no parameter', () => {
    scaffolding.url = '/api/cloneablegames';
    scaffolding.get(ApiCloneableGame.INSTANCE, res);
    expect(res.statusCode).eq(400);
    expect(res.content).eq('Bad request: id parameter missing');
  });

  it('has error while loading', () => {
    Database.getInstance().getPlayerCount = (gameId, cb) => {
      expect(gameId).eq('invalidId');
      cb(new Error('Segmentation fault'), undefined);
    };
    scaffolding.url = '/api/cloneablegames?id=invalidId';
    scaffolding.get(ApiCloneableGame.INSTANCE, res);
    expect(res.statusCode).eq(500);
    expect(res.content).eq('Internal server error: Segmentation fault');
  });

  it('does not find game', () => {
    Database.getInstance().getPlayerCount = (gameId, cb) => {
      expect(gameId).eq('notfound');
      cb(undefined, undefined);
    };
    scaffolding.url = '/api/cloneablegames?id=notfound';
    scaffolding.get(ApiCloneableGame.INSTANCE, res);
    expect(res.statusCode).eq(404);
    expect(res.content).eq('Not found');
  });

  it('finds game', () => {
    Database.getInstance().getPlayerCount = (_gameId, cb) => {
      cb(undefined, 2);
    };
    scaffolding.url = '/api/cloneablegames?id=g456';
    scaffolding.get(ApiCloneableGame.INSTANCE, res);
    expect(res.statusCode).eq(200);
    expect(res.content).eq(JSON.stringify({
      gameId: 'g456',
      playerCount: 2,
    }));
  });
});
