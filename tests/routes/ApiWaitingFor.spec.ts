import {expect} from 'chai';
import {ApiWaitingFor} from '../../src/server/routes/ApiWaitingFor';
import {Game} from '../../src/server/Game';
import {TestPlayer} from '../TestPlayer';
import {MockResponse} from './HttpMocks';
import {RouteTestScaffolding} from './RouteTestScaffolding';
import {GameId} from '../../src/common/Types';

describe('ApiWaitingFor', function() {
  let scaffolding: RouteTestScaffolding;
  let res: MockResponse;

  beforeEach(() => {
    scaffolding = new RouteTestScaffolding();
    res = new MockResponse();
  });

  it('fails when game not found', async () => {
    scaffolding.url = '/api/waitingfor?id=p-some-player-id&gameAge=123&undoCount=0';
    await scaffolding.get(ApiWaitingFor.INSTANCE, res);
    expect(res.statusCode).eq(404);
    expect(res.content).eq('Not found: cannot find game for that player');
  });

  it('fails when player not found', async () => {
    const player = TestPlayer.BLACK.newPlayer();
    const game = Game.newInstance('g' + player.id as GameId, [player], player);
    await scaffolding.ctx.gameLoader.add(game);
    (game as any).getPlayerById = function() {
      throw new Error('player does not exist');
    };

    scaffolding.url = '/api/waitingfor?id=' + player.id + '&gameAge=50&undoCount=0';
    await scaffolding.get(ApiWaitingFor.INSTANCE, res);
    expect(res.statusCode).eq(404);
    expect(res.content).eq('Not found: player not found');
  });

  it('sends model for player', async () => {
    const player = TestPlayer.BLACK.newPlayer();
    const game = Game.newInstance('game-id', [player], player);
    await scaffolding.ctx.gameLoader.add(game);

    scaffolding.url = '/api/waitingfor?id=' + player.id + '&gameAge=50&undoCount=0';
    await scaffolding.get(ApiWaitingFor.INSTANCE, res);
    expect(res.statusCode).eq(200);
    expect(res.content).eq('{"result":"GO"}');
  });

  it('fails when spectator not found', async () => {
    const player = TestPlayer.BLACK.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('game-id', [player, player2], player);
    await scaffolding.ctx.gameLoader.add(game);
    (game as any).getBySpectatorId = function() {
      throw new Error('spectator does not exist');
    };

    scaffolding.url = '/api/waitingfor?id=' + game.spectatorId + '-invalid' + '&gameAge=50&undoCount=0';
    await scaffolding.get(ApiWaitingFor.INSTANCE, res);
    expect(res.statusCode).eq(404);
    expect(res.content).eq('Not found: cannot find game for that player');
  });

  it('sends model for spectator', async () => {
    const player = TestPlayer.BLACK.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('game-id', [player, player2], player, undefined, undefined, 's-spectatorid');
    await scaffolding.ctx.gameLoader.add(game);

    scaffolding.url = '/api/waitingfor?id=' + game.spectatorId + '&gameAge=50&undoCount=0';
    await scaffolding.get(ApiWaitingFor.INSTANCE, res);
    expect(res.statusCode).eq(200);
    expect(res.content).eq('{"result":"WAIT"}');
  });
});
