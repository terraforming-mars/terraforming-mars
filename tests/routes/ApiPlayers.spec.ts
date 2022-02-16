import * as http from 'http';
import {expect} from 'chai';
import {ApiPlayer} from '../../src/routes/ApiPlayer';
import {Route} from '../../src/routes/Route';
import {Game} from '../../src/Game';
import {TestPlayers} from '../TestPlayers';
import {MockResponse} from './HttpMocks';
import {IContext} from '../../src/routes/IHandler';
import {FakeGameLoader} from './FakeGameLoader';
import {PlayerViewModel} from '../../src/common/models/PlayerModel';

describe('ApiPlayer', function() {
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

  it('fails game not found', () => {
    req.url = '/api/player?id=googoo';
    ctx.url = new URL('http://boo.com' + req.url);
    ApiPlayer.INSTANCE.get(req, res.hide(), ctx);
    expect(res.content).eq('Not found');
  });

  it('pulls player', () => {
    const player = TestPlayers.BLACK.newPlayer();
    req.url = '/api/player?id=' + player.id;
    ctx.url = new URL('http://boo.com' + req.url);
    const game = Game.newInstance('game-id', [player], player);
    ctx.gameLoader.add(game);
    ApiPlayer.INSTANCE.get(req, res.hide(), ctx);
    const response: PlayerViewModel = JSON.parse(res.content);
    expect(response.id).eq(player.id);
  });
});
