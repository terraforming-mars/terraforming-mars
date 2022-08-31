import {expect} from 'chai';
import {ApiGameLogs} from '../../src/server/routes/ApiGameLogs';
import {Game} from '../../src/server/Game';
import {TestPlayer} from '../TestPlayer';
import {MockResponse} from './HttpMocks';
import {RouteTestScaffolding} from './RouteTestScaffolding';
import {Phase} from '../../src/common/Phase';
import {use} from 'chai';
import chaiAsPromised = require('chai-as-promised');
use(chaiAsPromised);

describe('ApiGameLogs', function() {
  let scaffolding: RouteTestScaffolding;
  let res: MockResponse;

  beforeEach(() => {
    scaffolding = new RouteTestScaffolding();
    res = new MockResponse();
  });

  it('fails when id not provided', async () => {
    scaffolding.url = '/api/game/logs';
    await scaffolding.get(ApiGameLogs.INSTANCE, res);
    expect(res.content).eq('Bad request: missing id parameter');
  });

  it('fails with invalid id', async () => {
    scaffolding.url = '/api/game/logs?id=game-id';
    await scaffolding.get(ApiGameLogs.INSTANCE, res);
    expect(res.content).eq('Bad request: invalid player id');
  });

  it('fails when game not found', async () => {
    scaffolding.url = '/api/game/logs?id=player-invalid-id';
    await scaffolding.get(ApiGameLogs.INSTANCE, res);
    expect(res.content).eq('Not found: game not found');
  });

  it('pulls logs when no generation provided', async () => {
    const player = TestPlayer.BLACK.newPlayer();
    scaffolding.url = '/api/game/logs?id=' + player.id;
    const game = Game.newInstance('game-id', [player], player);
    await scaffolding.ctx.gameLoader.add(game);
    game.log('Generation ${0}', (b) => b.forNewGeneration().number(50));
    await scaffolding.get(ApiGameLogs.INSTANCE, res);
    const messages = JSON.parse(res.content);
    expect(messages.length).gt(1);
    expect(messages[messages.length - 1].message).eq('Generation ${0}');
    expect(messages[messages.length - 1].data[0].value).eq('50');
  });

  it('pulls logs for most recent generation', async () => {
    const player = TestPlayer.BLACK.newPlayer();
    scaffolding.url = '/api/game/logs?id=' + player.id + '&generation=50';
    const game = Game.newInstance('game-id', [player], player);
    await scaffolding.ctx.gameLoader.add(game);
    game.log('Generation ${0}', (b) => b.forNewGeneration().number(50));
    await scaffolding.get(ApiGameLogs.INSTANCE, res);
    const messages = JSON.parse(res.content);
    expect(messages.length).eq(1);
    expect(messages[messages.length - 1].message).eq('Generation ${0}');
    expect(messages[messages.length - 1].data[0].value).eq('50');
  });

  it('pulls logs for first generation', async () => {
    const player = TestPlayer.BLACK.newPlayer();
    scaffolding.url = '/api/game/logs?id=' + player.id;
    const game = Game.newInstance('game-id', [player], player);
    await scaffolding.ctx.gameLoader.add(game);
    await scaffolding.get(ApiGameLogs.INSTANCE, res);
    const messages = JSON.parse(res.content);
    expect(messages.length).gt(1);
    expect(messages[messages.length - 1].message).eq('Generation ${0}');
    expect(messages[messages.length - 1].data[0].value).eq('1');
  });

  it('pulls logs for missing generation', async () => {
    const player = TestPlayer.BLACK.newPlayer();
    scaffolding.url = '/api/game/logs?id=' + player.id + '&generation=2';
    const game = Game.newInstance('game-id', [player], player);
    await scaffolding.ctx.gameLoader.add(game);
    await scaffolding.get(ApiGameLogs.INSTANCE, res);
    const messages = JSON.parse(res.content);
    expect(messages.length).eq(0);
  });

  [{idx: 0, color: 'Yellow'}, {idx: 1, color: 'Orange'}, {idx: 2, color: 'Blue'}].forEach((entry) => {
    it('omits private logs for other players: ' + entry.color, async () => {
      const yellowPlayer = TestPlayer.YELLOW.newPlayer();
      const orangePlayer = TestPlayer.ORANGE.newPlayer();
      const bluePlayer = TestPlayer.BLUE.newPlayer();

      const players = [yellowPlayer, orangePlayer, bluePlayer];
      const playerUnderTest = players[entry.idx];

      const game = Game.newInstance('game-id', players, yellowPlayer);
      await scaffolding.ctx.gameLoader.add(game);

      // Remove logs to-date to simplify the test
      game.gameLog.length = 0;
      game.log('All players see this.');
      game.log('Yellow player sees this.', (_b) => {}, {reservedFor: yellowPlayer});
      game.log('Orange player sees this.', (_b) => {}, {reservedFor: orangePlayer});
      game.log('Blue player sees this.', (_b) => {}, {reservedFor: bluePlayer});

      scaffolding.url = '/api/game/logs?id=' + playerUnderTest.id;
      await scaffolding.get(ApiGameLogs.INSTANCE, res);
      const messages = JSON.parse(res.content);

      expect(messages.length).eq(2);
      expect(messages[0].message).eq('All players see this.');
      expect(messages[1].message).eq(`${entry.color} player sees this.`);
    });
  });

  it('Cannot pull full logs before game end', async () => {
    const player = TestPlayer.BLACK.newPlayer();
    scaffolding.url = '/api/game/logs?id=' + player.id + '&full';
    const game = Game.newInstance('game-id', [player], player);
    await scaffolding.ctx.gameLoader.add(game);
    await scaffolding.get(ApiGameLogs.INSTANCE, res);
    expect(res.content).eq('Bad request: cannot fetch game-end log');
  });

  it('Pulls full logs at game end', async () => {
    const player = TestPlayer.BLACK.newPlayer();
    scaffolding.url = '/api/game/logs?id=' + player.id + '&full';
    const game = Game.newInstance('game-id', [player], player);
    game.phase = Phase.END;
    await scaffolding.ctx.gameLoader.add(game);
    await scaffolding.get(ApiGameLogs.INSTANCE, res);
    expect(res.content).to.match(/^Drew and discarded/);
  });
});
