import * as http from 'http';
import {expect} from 'chai';
import {ApiWaitingFor} from '../../src/routes/ApiWaitingFor';
import {Route} from '../../src/routes/Route';
import {Game} from '../../src/Game';
import {TestPlayers} from '../TestPlayers';
import {MockResponse} from './HttpMocks';
import {IContext} from '../../src/routes/IHandler';
import {FakeGameLoader} from './FakeGameLoader';

describe('ApiWaitingFor', function() {
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

  it('fails when game not found', () => {
    req.url = '/api/waitingfor?id=game-id&prev-game-age=123';
    ctx.url = new URL('http://boo.com' + req.url);
    ApiWaitingFor.INSTANCE.get(req, res.hide(), ctx);
    expect(res.content).eq('Not found: cannot find game for that player');
  });

  it('fails when player not found', () => {
    const player = TestPlayers.BLACK.newPlayer();
    req.url = '/api/waitingfor?id=' + player.id + '&prev-game-age=50';
    ctx.url = new URL('http://boo.com' + req.url);
    const game = Game.newInstance('game-id', [player], player);
    ctx.gameLoader.add(game);
    (game as any).getPlayerById = function() {
      throw new Error('player does not exist');
    };
    ApiWaitingFor.INSTANCE.get(req, res.hide(), ctx);
    expect(res.content).eq('Not found: player not found');
  });

  it('sends model', () => {
    const player = TestPlayers.BLACK.newPlayer();
    req.url = '/api/waitingfor?id=' + player.id + '&prev-game-age=50';
    ctx.url = new URL('http://boo.com' + req.url);
    const game = Game.newInstance('game-id', [player], player);
    ctx.gameLoader.add(game);
    ApiWaitingFor.INSTANCE.get(req, res.hide(), ctx);
    expect(res.content).eq('{"result":"GO"}');
  });
});
