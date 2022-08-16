import {expect} from 'chai';
import {ApiSpectator} from '../../src/server/routes/ApiSpectator';
import {Game} from '../../src/server/Game';
import {TestPlayer} from '../TestPlayer';
import {MockResponse} from './HttpMocks';
import {SpectatorModel} from '../../src/common/models/SpectatorModel';
import {RouteTestScaffolding} from './RouteTestScaffolding';

describe('ApiSpectator', function() {
  let scaffolding: RouteTestScaffolding;
  let res: MockResponse;

  beforeEach(() => {
    scaffolding = new RouteTestScaffolding();
    res = new MockResponse();
  });

  it('fails game not found', async () => {
    scaffolding.url = '/api/spectator?id=googoo';
    await scaffolding.get(ApiSpectator.INSTANCE, res);
    expect(res.content).eq('Not found');
  });

  it('fails invalid id', async () => {
    const player = TestPlayer.BLACK.newPlayer();
    const game = Game.newInstance('game-id', [player], player, undefined, undefined, 'spectator-id');
    scaffolding.url = '/api/spectator?id=' + player.id;
    scaffolding.ctx.gameLoader.add(game);
    await scaffolding.get(ApiSpectator.INSTANCE, res);
    expect(res.content).eq('Not found');
  });

  it('pulls spectator', async () => {
    const player = TestPlayer.BLACK.newPlayer();
    const game = Game.newInstance('game-id', [player], player, undefined, undefined, 'spectator-id');
    scaffolding.url = '/api/spectator?id=' + game.spectatorId;
    scaffolding.ctx.gameLoader.add(game);
    await scaffolding.get(ApiSpectator.INSTANCE, res);
    const response: SpectatorModel = JSON.parse(res.content);
    expect(response.id).eq('spectator-id');
  });
});
