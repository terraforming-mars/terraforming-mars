import * as http from 'http';
import {expect} from 'chai';
import {ApiGames} from '../../src/routes/ApiGames';
import {Route} from '../../src/routes/Route';
import {Game} from '../../src/Game';
import {TestPlayers} from '../TestPlayers';
import {MockResponse} from './HttpMocks';
import {IContext} from '../../src/routes/IHandler';
import {FakeGameLoader} from './FakeGameLoader';

describe('ApiGames', function() {
  let req: http.IncomingMessage;
  let res: MockResponse;
  let ctx: IContext;

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

  it('validates server id', () => {
    req.url = '/api/games';
    ctx.url = new URL('http://boo.com' + req.url);
    ApiGames.INSTANCE.processRequest(req, res.hide(), ctx);
    expect(res.content).eq('Not authorized');
  });

  it('simple', () => {
    ApiGames.INSTANCE.get(req, res.hide(), ctx);
    expect(res.content).eq('[]');
  });

  it('a game', () => {
    const player = TestPlayers.BLACK.newPlayer();
    ctx.gameLoader.add(Game.newInstance('game-id', [player], player));
    ApiGames.INSTANCE.get(req, res.hide(), ctx);
    expect(res.content).eq('["game-id"]');
  });
});
