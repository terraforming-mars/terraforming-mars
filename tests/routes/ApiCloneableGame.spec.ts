import * as http from 'http';
import {expect} from 'chai';
import {ApiCloneableGame} from '../../src/routes/ApiCloneableGame';
import {Route} from '../../src/routes/Route';
import {FakeGameLoader} from './FakeGameLoader';
import {MockResponse} from './HttpMocks';
import {IContext} from '../../src/routes/IHandler';
import {Database} from '../../src/database/Database';

describe('ApiCloneableGame', () => {
  let req: http.IncomingMessage;
  let res: MockResponse;
  let ctx: IContext;
  const origGetClonableGameByGameId = Database.getInstance().getClonableGameByGameId;

  // Strictly speaking |parameters| can also accept a fragment.
  const setRequest = function(parameters: string) {
    req.url = parameters;
    ctx.url = new URL('http://boo.com' + parameters);
  };

  beforeEach(() => {
    req = {} as http.IncomingMessage;
    res = new MockResponse();
    ctx = {
      route: new Route(),
      serverId: '1',
      url: new URL('http://boo.com'),
      gameLoader: new FakeGameLoader(),
    };
  });

  afterEach(() => {
    Database.getInstance().getClonableGameByGameId = origGetClonableGameByGameId;
  });

  it('no parameter', () => {
    setRequest('/api/cloneablegames');
    ApiCloneableGame.INSTANCE.get(req, res.hide(), ctx);
    expect(res.statusCode).eq(400);
    expect(res.content).eq('Bad request: id parameter missing');
  });

  it('has error while loading', () => {
    Database.getInstance().getClonableGameByGameId = (gameId, cb) => {
      expect(gameId).eq('invalidId');
      cb(new Error('Segmentation fault'), undefined);
    };
    setRequest('/api/cloneablegames?id=invalidId');
    ApiCloneableGame.INSTANCE.get(req, res.hide(), ctx);
    expect(res.statusCode).eq(500);
    expect(res.content).eq('Internal server error: Segmentation fault');
  });

  it('does not find game', () => {
    Database.getInstance().getClonableGameByGameId = (gameId, cb) => {
      expect(gameId).eq('notfound');
      cb(undefined, undefined);
    };
    setRequest('/api/cloneablegames?id=notfound');
    ApiCloneableGame.INSTANCE.get(req, res.hide(), ctx);
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
    setRequest('/api/cloneablegames?id=' + expected.gameId);
    ApiCloneableGame.INSTANCE.get(req, res.hide(), ctx);
    expect(res.statusCode).eq(200);
    expect(res.content).eq(JSON.stringify(expected));
  });
});
