import {expect} from 'chai';
import {ApiGames} from '../../src/server/routes/ApiGames';
import {Game} from '../../src/server/Game';
import {TestPlayer} from '../TestPlayer';
import {MockResponse} from './HttpMocks';
import {RouteTestScaffolding} from './RouteTestScaffolding';

describe('ApiGames', function() {
  let res: MockResponse;
  let scaffolding: RouteTestScaffolding;


  beforeEach(() => {
    scaffolding = new RouteTestScaffolding();
    res = new MockResponse();
  });

  it('validates server id', () => {
    scaffolding.url = '/api/games';
    ApiGames.INSTANCE.processRequest(scaffolding.req, res.hide(), scaffolding.ctx);
    expect(res.content).eq('Not authorized');
  });

  it('simple', async () => {
    scaffolding.url = '/api/games?serverId=1';
    scaffolding.req.method = 'GET';
    await ApiGames.INSTANCE.processRequest(scaffolding.req, res.hide(), scaffolding.ctx);
    expect(res.content).eq('[]');
  });

  it('a game', async () => {
    const player = TestPlayer.BLACK.newPlayer();
    await scaffolding.ctx.gameLoader.add(Game.newInstance('game-id', [player], player));
    await ApiGames.INSTANCE.get(scaffolding.req, res.hide(), scaffolding.ctx);
    // Player ids aren't exactly available in the fake game loader.
    // A base class shared between GameLoader and FakeGameLoader would fix that.
    expect(res.content).eq('[{"gameId":"game-id","participantIds":[]}]');
  });
});
