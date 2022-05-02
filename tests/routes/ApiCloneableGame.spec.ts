import {expect} from 'chai';
import {ApiCloneableGame} from '../../src/routes/ApiCloneableGame';
import {MockResponse} from './HttpMocks';
import {Database} from '../../src/database/Database';
import {RouteTestScaffolding} from './RouteTestScaffolding';

describe('ApiCloneableGame', () => {
  let scaffolding: RouteTestScaffolding;
  let res: MockResponse;
  const origGetClonableGameByGameId = Database.getInstance().getClonableGameByGameId;

  beforeEach(() => {
    scaffolding = new RouteTestScaffolding();
    res = new MockResponse();
  });

  afterEach(() => {
    Database.getInstance().getClonableGameByGameId = origGetClonableGameByGameId;
  });

  it('no parameter', () => {
    scaffolding.url = '/api/cloneablegames';
    scaffolding.get(ApiCloneableGame.INSTANCE, res);
    expect(res.statusCode).eq(400);
    expect(res.content).eq('Bad request: id parameter missing');
  });

  it('has error while loading', () => {
    Database.getInstance().getClonableGameByGameId = (gameId, cb) => {
      expect(gameId).eq('invalidId');
      cb(new Error('Segmentation fault'), undefined);
    };
    scaffolding.url = '/api/cloneablegames?id=invalidId';
    scaffolding.get(ApiCloneableGame.INSTANCE, res);
    expect(res.statusCode).eq(500);
    expect(res.content).eq('Internal server error: Segmentation fault');
  });

  it('does not find game', () => {
    Database.getInstance().getClonableGameByGameId = (gameId, cb) => {
      expect(gameId).eq('notfound');
      cb(undefined, undefined);
    };
    scaffolding.url = '/api/cloneablegames?id=notfound';
    scaffolding.get(ApiCloneableGame.INSTANCE, res);
    expect(res.statusCode).eq(404);
    expect(res.content).eq('Not found');
  });

  it('finds game', () => {
    const expected = {
      gameId: 'found',
      playerCount: 1,
    };
    Database.getInstance().getClonableGameByGameId = (gameId, cb) => {
      expect(gameId).eq(expected.gameId);
      cb(undefined, expected);
    };
    scaffolding.url = '/api/cloneablegames?id=' + expected.gameId;
    scaffolding.get(ApiCloneableGame.INSTANCE, res);
    expect(res.statusCode).eq(200);
    expect(res.content).eq(JSON.stringify(expected));
  });
});
