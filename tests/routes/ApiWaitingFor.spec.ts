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
    req = {headers: {}} as http.IncomingMessage;
    res = new MockResponse();
    ctx = {
      route: new Route(),
      serverId: '1',
      url: new URL('http://boo.com'),
      gameLoader: new FakeGameLoader(),
    };
  });

  it('fails when game not found', () => {
    req.url = '/api/waitingfor?id=p-some-player-id&gameAge=123&undoCount=0';
    ctx.url = new URL('http://boo.com' + req.url);
    ApiWaitingFor.INSTANCE.get(req, res.hide(), ctx);
    expect(res.statusCode).eq(404);
    expect(res.content).eq('Not found: cannot find game for that player');
  });

  it('fails when player not found', () => {
    const player = TestPlayers.BLACK.newPlayer();
    const game = Game.newInstance(player.id, [player], player);
    ctx.gameLoader.add(game);
    (game as any).getPlayerById = function() {
      throw new Error('player does not exist');
    };

    req.url = '/api/waitingfor?id=' + player.id + '&gameAge=50&undoCount=0';
    ctx.url = new URL('http://boo.com' + req.url);
    ApiWaitingFor.INSTANCE.get(req, res.hide(), ctx);
    expect(res.statusCode).eq(404);
    expect(res.content).eq('Not found: player not found');
  });

  it('sends model for player', () => {
    const player = TestPlayers.BLACK.newPlayer();
    const game = Game.newInstance('game-id', [player], player);
    ctx.gameLoader.add(game);

    req.url = '/api/waitingfor?id=' + player.id + '&gameAge=50&undoCount=0';
    ctx.url = new URL('http://boo.com' + req.url);
    ApiWaitingFor.INSTANCE.get(req, res.hide(), ctx);
    expect(res.statusCode).eq(200);
    expect(res.content).eq('{"result":"GO"}');
  });

  it('fails when spectator not found', () => {
    const player = TestPlayers.BLACK.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('game-id', [player, player2], player);
    ctx.gameLoader.add(game);
    (game as any).getBySpectatorId = function() {
      throw new Error('spectator does not exist');
    };

    req.url = '/api/waitingfor?id=' + game.spectatorId + '-invalid' + '&gameAge=50&undoCount=0';
    ctx.url = new URL('http://boo.com' + req.url);
    ApiWaitingFor.INSTANCE.get(req, res.hide(), ctx);
    expect(res.statusCode).eq(404);
    expect(res.content).eq('Not found: cannot find game for that player');
  });

  it('sends model for spectator', () => {
    const player = TestPlayers.BLACK.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('game-id', [player, player2], player, undefined, undefined, 's-spectatorid');
    ctx.gameLoader.add(game);

    req.url = '/api/waitingfor?id=' + game.spectatorId + '&gameAge=50&undoCount=0';
    ctx.url = new URL('http://boo.com' + req.url);
    ApiWaitingFor.INSTANCE.get(req, res.hide(), ctx);
    expect(res.statusCode).eq(200);
    expect(res.content).eq('{"result":"WAIT"}');
  });
});
