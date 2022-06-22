import {expect} from 'chai';
import {ApiWaitingFor} from '../../src/routes/ApiWaitingFor';
import {Game} from '../../src/Game';
import {TestPlayers} from '../TestPlayers';
import {MockResponse} from './HttpMocks';
import {RouteTestScaffolding} from './RouteTestScaffolding';

describe('ApiWaitingFor', function() {
  let scaffolding: RouteTestScaffolding;
  let res: MockResponse;

  beforeEach(() => {
    scaffolding = new RouteTestScaffolding();
    res = new MockResponse();
  });

  it('fails when game not found', () => {
    scaffolding.url = '/api/waitingfor?id=p-some-player-id&gameAge=123&undoCount=0';
    scaffolding.get(ApiWaitingFor.INSTANCE, res);
    expect(res.statusCode).eq(404);
    expect(res.content).eq('Not found: cannot find game for that player');
  });

  it('fails when player not found', () => {
    const player = TestPlayers.BLACK.newPlayer();
    const game = Game.newInstance(player.id, [player], player);
    scaffolding.ctx.gameLoader.add(game);
    (game as any).getPlayerById = function() {
      throw new Error('player does not exist');
    };

    scaffolding.url = '/api/waitingfor?id=' + player.id + '&gameAge=50&undoCount=0';
    scaffolding.get(ApiWaitingFor.INSTANCE, res);
    expect(res.statusCode).eq(404);
    expect(res.content).eq('Not found: player not found');
  });

  it('sends model for player', () => {
    const player = TestPlayers.BLACK.newPlayer();
    const game = Game.newInstance('game-id', [player], player);
    scaffolding.ctx.gameLoader.add(game);

    scaffolding.url = '/api/waitingfor?id=' + player.id + '&gameAge=50&undoCount=0';
    scaffolding.get(ApiWaitingFor.INSTANCE, res);
    expect(res.statusCode).eq(200);
    expect(res.content).eq('{"result":"GO"}');
  });

  it('fails when spectator not found', () => {
    const player = TestPlayers.BLACK.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('game-id', [player, player2], player);
    scaffolding.ctx.gameLoader.add(game);
    (game as any).getBySpectatorId = function() {
      throw new Error('spectator does not exist');
    };

    scaffolding.url = '/api/waitingfor?id=' + game.spectatorId + '-invalid' + '&gameAge=50&undoCount=0';
    scaffolding.get(ApiWaitingFor.INSTANCE, res);
    expect(res.statusCode).eq(404);
    expect(res.content).eq('Not found: cannot find game for that player');
  });

  it('sends model for spectator', () => {
    const player = TestPlayers.BLACK.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('game-id', [player, player2], player, undefined, undefined, 's-spectatorid');
    scaffolding.ctx.gameLoader.add(game);

    scaffolding.url = '/api/waitingfor?id=' + game.spectatorId + '&gameAge=50&undoCount=0';
    scaffolding.get(ApiWaitingFor.INSTANCE, res);
    expect(res.statusCode).eq(200);
    expect(res.content).eq('{"result":"WAIT"}');
  });
});
