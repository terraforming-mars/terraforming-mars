import {expect} from 'chai';
import {Autopass} from '../../src/server/routes/Autopass';
import {Game} from '../../src/server/Game';
import {TestPlayer} from '../TestPlayer';
import {MockResponse} from './HttpMocks';
import {RouteTestScaffolding} from './RouteTestScaffolding';
import {GameId} from '../../src/common/Types';
import {statusCode} from '../../src/common/http/statusCode';

describe('Autopass', function() {
  let scaffolding: RouteTestScaffolding;
  let res: MockResponse;

  beforeEach(() => {
    scaffolding = new RouteTestScaffolding();
    res = new MockResponse();
  });

  it('fails when game not found', async () => {
    scaffolding.url = '/autopass?id=p-some-player-id&gameAge=123&undoCount=0';
    await scaffolding.get(Autopass.INSTANCE, res);
    expect(res.statusCode).eq(statusCode.notFound);
    expect(res.content).eq('Not found: cannot find game for that player');
  });

  it('fails when player not found', async () => {
    const player = TestPlayer.BLACK.newPlayer();
    const game = Game.newInstance('g' + player.id as GameId, [player], player);
    await scaffolding.ctx.gameLoader.add(game);
    (game as any).getPlayerById = function() {
      throw new Error('player does not exist');
    };

    scaffolding.url = '/autopass?id=' + player.id + '&autopass=true';
    await scaffolding.get(Autopass.INSTANCE, res);
    expect(res.statusCode).eq(statusCode.notFound);
    expect(res.content).eq('Not found: player not found');
  });

  it('sets autopass', async () => {
    const player = TestPlayer.BLACK.newPlayer();
    const game = Game.newInstance('game-id', [player], player);
    await scaffolding.ctx.gameLoader.add(game);

    scaffolding.url = '/autopass?id=' + player.id + '&autopass=true';
    await scaffolding.get(Autopass.INSTANCE, res);
    expect(res.statusCode).eq(statusCode.ok);
    expect(res.content).eq('');
    expect(player.autopass).eq(true);
  });

  it('disables autopass', async () => {
    const player = TestPlayer.BLACK.newPlayer();
    const game = Game.newInstance('game-id', [player], player);
    await scaffolding.ctx.gameLoader.add(game);
    player.autopass = true;

    scaffolding.url = '/autopass?id=' + player.id + '&autopass=false';
    await scaffolding.get(Autopass.INSTANCE, res);
    expect(res.statusCode).eq(statusCode.ok);
    expect(res.content).eq('');
    expect(player.autopass).eq(false);
  });

  it('fails when spectator not found', async () => {
    const player = TestPlayer.BLACK.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('game-id', [player, player2], player);
    await scaffolding.ctx.gameLoader.add(game);
    (game as any).getBySpectatorId = function() {
      throw new Error('spectator does not exist');
    };

    scaffolding.url = '/autopass?id=' + game.spectatorId + '&autopass=true';
    await scaffolding.get(Autopass.INSTANCE, res);
    expect(res.statusCode).eq(statusCode.badRequest);
    expect(res.content).eq('Bad request: invalid player id');
  });
});
