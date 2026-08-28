import {expect} from 'chai';
import {EndGameLog} from '../../src/server/routes/EndGameLog';
import {MockResponse} from './HttpMocks';
import {RouteTestScaffolding} from './RouteTestScaffolding';
import {Phase} from '../../src/common/Phase';
import {statusCode} from '../../src/common/http/statusCode';
import {testGame} from '@tests/TestGame';

describe('EndGameLog', () => {
  let scaffolding: RouteTestScaffolding;
  let res: MockResponse;

  beforeEach(() => {
    scaffolding = new RouteTestScaffolding();
    res = new MockResponse();
  });

  it('fails when id not provided', async () => {
    scaffolding.url = '/end_game_log';
    await scaffolding.get(EndGameLog.INSTANCE, res);
    expect(res.statusCode).eq(statusCode.badRequest);
    expect(res.content).eq('Bad request: missing id parameter');
  });

  it('fails with invalid id', async () => {
    scaffolding.url = '/end_game_log?id=game-id';
    await scaffolding.get(EndGameLog.INSTANCE, res);
    expect(res.statusCode).eq(statusCode.badRequest);
    expect(res.content).eq('Bad request: invalid player id');
  });

  it('fails when game not found', async () => {
    scaffolding.url = '/end_game_log?id=player-invalid-id';
    await scaffolding.get(EndGameLog.INSTANCE, res);
    expect(res.statusCode).eq(statusCode.notFound);
    expect(res.content).eq('Not found: game not found');
  });

  it('fails before game end', async () => {
    const [game, player] = testGame(1);
    scaffolding.url = '/end_game_log?id=' + player.id;
    await scaffolding.ctx.gameLoader.add(game);
    await scaffolding.get(EndGameLog.INSTANCE, res);
    expect(res.statusCode).eq(statusCode.badRequest);
    expect(res.content).eq('Bad request: cannot fetch game-end log');
  });

  it('pulls logs at game end', async () => {
    const [game, player/* , player2 */] = testGame(2);
    scaffolding.url = '/end_game_log?id=' + player.id;
    game.phase = Phase.END;
    await scaffolding.ctx.gameLoader.add(game);
    await scaffolding.get(EndGameLog.INSTANCE, res);
    expect(res.getHeader('Content-Type')).eq('text/plain');
    expect(res.content).to.match(/^First player this generation is player1/);
  });

  it('pulls logs for spectator', async () => {
    const [game] = testGame(2);
    game.phase = Phase.END;
    await scaffolding.ctx.gameLoader.add(game);
    scaffolding.url = '/end_game_log?id=' + game.spectatorId;
    await scaffolding.get(EndGameLog.INSTANCE, res);
    expect(res.content).to.match(/^First player this generation is player1/);
  });
});
