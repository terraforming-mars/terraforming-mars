import {expect} from 'chai';
import {ApiGameLogs} from '../../src/routes/ApiGameLogs';
import {Game} from '../../src/Game';
import {TestPlayers} from '../TestPlayers';
import {MockResponse} from './HttpMocks';
import {RouteTestScaffolding} from './RouteTestScaffolding';

describe('ApiGameLogs', function() {
  let scaffolding: RouteTestScaffolding;
  let res: MockResponse;

  beforeEach(() => {
    scaffolding = new RouteTestScaffolding();
    res = new MockResponse();
  });

  it('fails when id not provided', () => {
    scaffolding.url = '/api/game/logs';
    scaffolding.get(ApiGameLogs.INSTANCE, res);
    expect(res.content).eq('Bad request: must provide player id as the id parameter');
  });

  it('fails when game not found', () => {
    scaffolding.url = '/api/game/logs?id=game-id';
    scaffolding.get(ApiGameLogs.INSTANCE, res);
    expect(res.content).eq('Not found: game not found');
  });

  it('pulls logs when no generation provided', () => {
    const player = TestPlayers.BLACK.newPlayer();
    scaffolding.url = '/api/game/logs?id=' + player.id;
    const game = Game.newInstance('game-id', [player], player);
    scaffolding.ctx.gameLoader.add(game);
    game.log('Generation ${0}', (b) => b.forNewGeneration().number(50));
    scaffolding.get(ApiGameLogs.INSTANCE, res);
    const messages = JSON.parse(res.content);
    expect(messages.length).gt(1);
    expect(messages[messages.length - 1].message).eq('Generation ${0}');
    expect(messages[messages.length - 1].data[0].value).eq('50');
  });

  it('pulls logs for most recent generation', () => {
    const player = TestPlayers.BLACK.newPlayer();
    scaffolding.url = '/api/game/logs?id=' + player.id + '&generation=50';
    const game = Game.newInstance('game-id', [player], player);
    scaffolding.ctx.gameLoader.add(game);
    game.log('Generation ${0}', (b) => b.forNewGeneration().number(50));
    scaffolding.get(ApiGameLogs.INSTANCE, res);
    const messages = JSON.parse(res.content);
    expect(messages.length).eq(1);
    expect(messages[messages.length - 1].message).eq('Generation ${0}');
    expect(messages[messages.length - 1].data[0].value).eq('50');
  });

  it('pulls logs for first generation', () => {
    const player = TestPlayers.BLACK.newPlayer();
    scaffolding.url = '/api/game/logs?id=' + player.id;
    const game = Game.newInstance('game-id', [player], player);
    scaffolding.ctx.gameLoader.add(game);
    scaffolding.get(ApiGameLogs.INSTANCE, res);
    const messages = JSON.parse(res.content);
    expect(messages.length).gt(1);
    expect(messages[messages.length - 1].message).eq('Generation ${0}');
    expect(messages[messages.length - 1].data[0].value).eq('1');
  });

  it('pulls logs for missing generation', () => {
    const player = TestPlayers.BLACK.newPlayer();
    scaffolding.url = '/api/game/logs?id=' + player.id + '&generation=2';
    const game = Game.newInstance('game-id', [player], player);
    scaffolding.ctx.gameLoader.add(game);
    scaffolding.get(ApiGameLogs.INSTANCE, res);
    const messages = JSON.parse(res.content);
    expect(messages.length).eq(0);
  });

  [{idx: 0, color: 'Yellow'}, {idx: 1, color: 'Orange'}, {idx: 2, color: 'Blue'}].forEach((entry) => {
    it('omits private logs for other players: ' + entry.color, () => {
      const yellowPlayer = TestPlayers.YELLOW.newPlayer();
      const orangePlayer = TestPlayers.ORANGE.newPlayer();
      const bluePlayer = TestPlayers.BLUE.newPlayer();

      const players = [yellowPlayer, orangePlayer, bluePlayer];
      const playerUnderTest = players[entry.idx];

      const game = Game.newInstance('game-id', players, yellowPlayer);
      scaffolding.ctx.gameLoader.add(game);

      // Remove logs to-date to simplify the test
      game.gameLog.length = 0;
      game.log('All players see this.');
      game.log('Yellow player sees this.', (_b) => {}, {reservedFor: yellowPlayer});
      game.log('Orange player sees this.', (_b) => {}, {reservedFor: orangePlayer});
      game.log('Blue player sees this.', (_b) => {}, {reservedFor: bluePlayer});

      scaffolding.url = '/api/game/logs?id=' + playerUnderTest.id;
      scaffolding.get(ApiGameLogs.INSTANCE, res);
      const messages = JSON.parse(res.content);

      expect(messages.length).eq(2);
      expect(messages[0].message).eq('All players see this.');
      expect(messages[1].message).eq(`${entry.color} player sees this.`);
    });
  });
});
