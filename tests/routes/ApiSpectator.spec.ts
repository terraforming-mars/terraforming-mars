import {expect} from 'chai';
import {ApiSpectator} from '../../src/server/routes/ApiSpectator';
import {MockResponse} from './HttpMocks';
import {SpectatorModel} from '../../src/common/models/SpectatorModel';
import {RouteTestScaffolding} from './RouteTestScaffolding';
import {statusCode} from '@/common/http/statusCode';
import {testGame} from '@tests/TestGame';

describe('ApiSpectator', () => {
  let scaffolding: RouteTestScaffolding;
  let res: MockResponse;

  beforeEach(() => {
    scaffolding = new RouteTestScaffolding();
    res = new MockResponse();
  });

  it('fails malformed id', async () => {
    scaffolding.url = '/api/spectator?id=googoo';
    await scaffolding.get(ApiSpectator.INSTANCE, res);
    expect(res.statusCode).eq(statusCode.badRequest);
    expect(res.content).eq('Bad request: invalid spectator id');
  });

  it('fails not found', async () => {
    const [game] = testGame(2);
    scaffolding.url = '/api/spectator?id=' + 's-invalid';
    scaffolding.ctx.gameLoader.add(game);
    await scaffolding.get(ApiSpectator.INSTANCE, res);
    expect(res.statusCode).eq(statusCode.notFound);
    expect(res.content).eq('Not found');
  });

  it('pulls spectator', async () => {
    const [game] = testGame(2);
    scaffolding.url = '/api/spectator?id=' + game.spectatorId;
    scaffolding.ctx.gameLoader.add(game);
    await scaffolding.get(ApiSpectator.INSTANCE, res);
    const response: SpectatorModel = JSON.parse(res.content);
    expect(response.id).eq('spectator-id');
  });
});
