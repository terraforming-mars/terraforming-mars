import {expect} from 'chai';
import {PlayerInput, playerInputMetrics} from '../../src/server/routes/PlayerInput';
import {MockRequest, MockResponse} from './HttpMocks';
import {Game} from '../../src/server/Game';
import {TestPlayer} from '../TestPlayer';
import {OrOptions} from '../../src/server/inputs/OrOptions';
import {UndoActionOption} from '../../src/server/inputs/UndoActionOption';
import {SelectOption} from '../../src/server/inputs/SelectOption';
import {RouteTestScaffolding} from './RouteTestScaffolding';
import {cast} from '@/common/utils/utils';
import {OrOptionsResponse} from '../../src/common/inputs/InputResponse';
import {CardName} from '../../src/common/cards/CardName';
import {Payment} from '../../src/common/inputs/Payment';
import {statusCode} from '@/common/http/statusCode';
import {FakeClock} from '../common/FakeClock';
import {RESPONDING_TOO_QUICKLY} from '@/common/app/AppErrorId';

describe('PlayerInput', () => {
  let scaffolding: RouteTestScaffolding;
  let req: MockRequest;
  let res: MockResponse;

  beforeEach(() => {
    req = new MockRequest();
    res = new MockResponse();
    scaffolding = new RouteTestScaffolding(req);
  });

  it('fails when id not provided', async () => {
    scaffolding.url = '/player/input';
    await scaffolding.post(PlayerInput.INSTANCE, res);
    expect(res.statusCode).eq(statusCode.badRequest);
    expect(res.content).eq('Bad request: missing id parameter');
  });

  it('performs undo action', async () => {
    const player = TestPlayer.BLUE.newPlayer({beginner: true});
    scaffolding.url = '/player/input?id=' + player.id;
    const game = Game.newInstance('gameid-foo', [player], player, 'spectatorid');

    const undoVersionOfPlayer = TestPlayer.BLUE.newPlayer({beginner: true});
    const undo = Game.newInstance('gameid-old', [undoVersionOfPlayer], undoVersionOfPlayer, 'spectatorid');

    await scaffolding.ctx.gameLoader.add(game);

    player.process({type: 'or', index: 1, response: {type: 'projectCard', card: CardName.POWER_PLANT_STANDARD_PROJECT, payment: Payment.of({megacredits: 11})}});
    const options = cast(player.getWaitingFor(), OrOptions);
    options.options.push(new UndoActionOption());
    scaffolding.ctx.gameLoader.restoreGameAt = (_gameId: string, _lastSaveId: number) => Promise.resolve(undo);

    const post = scaffolding.post(PlayerInput.INSTANCE, res);
    const emit = Promise.resolve().then(() => {
      const orOptionsResponse: OrOptionsResponse = {type: 'or', index: options.options.length - 1, response: {type: 'option'}};
      req.emitString(JSON.stringify(orOptionsResponse));
      req.emitter.emit('end');
    });
    await Promise.all(([emit, post]));

    const model = JSON.parse(res.content);
    expect(game.gameAge).not.eq(undo.gameAge);
    expect(model.game.gameAge).eq(undo.gameAge);
  });

  it('reverts to current game instance if undo fails', async () => {
    const player = TestPlayer.BLUE.newPlayer({beginner: true});
    scaffolding.url = '/player/input?id=' + player.id;
    const game = Game.newInstance('gameid-foo', [player], player, 'spectatorid');

    const undoVersionOfPlayer = TestPlayer.BLUE.newPlayer({beginner: true});
    const undo = Game.newInstance('gameid-old', [undoVersionOfPlayer], undoVersionOfPlayer, 'spectatorid');

    await scaffolding.ctx.gameLoader.add(game);

    player.process(<OrOptionsResponse>{type: 'or', index: 1, response: {type: 'projectCard', card: CardName.POWER_PLANT_STANDARD_PROJECT, payment: Payment.of({megacredits: 11})}});
    const options = cast(player.getWaitingFor(), OrOptions);
    options.options.push(new UndoActionOption());
    scaffolding.ctx.gameLoader.restoreGameAt = (_gameId: string, _lastSaveId: number) => Promise.reject(new Error('error'));

    const post = scaffolding.post(PlayerInput.INSTANCE, res);
    const emit = Promise.resolve().then(() => {
      const orOptionsResponse: OrOptionsResponse = {type: 'or', index: options.options.length - 1, response: {type: 'option'}};
      scaffolding.req.emitString(JSON.stringify(orOptionsResponse));
      scaffolding.req.emitter.emit('end');
    });
    await Promise.all(([emit, post]));

    const model = JSON.parse(res.content);
    expect(game.gameAge).not.eq(undo.gameAge);
    expect(model.game.gameAge).eq(model.game.gameAge);
  });

  it('sends 400 when input processing throws a plain Error', async () => {
    const player = TestPlayer.BLUE.newPlayer({beginner: true});
    scaffolding.url = '/player/input?id=' + player.id;
    const game = Game.newInstance('gameid-foo', [player], player, 'spectatorid');
    await scaffolding.ctx.gameLoader.add(game);

    const options = cast(player.getWaitingFor(), OrOptions);
    options.options.push(new SelectOption('Throw').andThen(() => {
      throw new Error('You cannot overspend heat');
    }));

    const post = scaffolding.post(PlayerInput.INSTANCE, res);
    const emit = Promise.resolve().then(() => {
      const orOptionsResponse: OrOptionsResponse = {type: 'or', index: options.options.length - 1, response: {type: 'option'}};
      req.emitString(JSON.stringify(orOptionsResponse));
      req.emitter.emit('end');
    });
    await Promise.all(([emit, post]));

    expect(res.statusCode).eq(statusCode.badRequest);
    expect(JSON.parse(res.content)).deep.eq({message: 'You cannot overspend heat'});
  });

  it('sends 400 on server error', async () => {
    const player = TestPlayer.BLUE.newPlayer();
    scaffolding.url = `/player/input?id=${player.id}`;
    const game = Game.newInstance('gameid', [player], player, 'spectatorid');
    await scaffolding.ctx.gameLoader.add(game);

    const post = scaffolding.post(PlayerInput.INSTANCE, res);
    const emit = Promise.resolve().then(() => {
      scaffolding.req.emitString('}{');
      scaffolding.req.emitter.emit('end');
    });
    await Promise.all(([emit, post]));

    expect(res.statusCode).eq(statusCode.badRequest);
    expect(res.content).matches(/Unexpected token/);
  });

  describe('response interval', () => {
    let clock: FakeClock;
    let player: TestPlayer;

    beforeEach(async () => {
      clock = scaffolding.ctx.clock as FakeClock;
      player = TestPlayer.BLUE.newPlayer({beginner: true});
      player.clock = clock;
      const game = Game.newInstance('gameid', [player], player, 'spectatorid');
      await scaffolding.ctx.gameLoader.add(game);
      playerInputMetrics.responseInterval.reset();
    });

    /**
     * POSTs `body` to `handler` as input from `playerId`, and waits for the response.
     *
     * Replaces `req` and `res` with fresh mocks, so after this returns, `res` holds this request's response.
     */
    async function send(handler: PlayerInput, playerId: string, body: string): Promise<void> {
      req = new MockRequest();
      res = new MockResponse();
      scaffolding.req = req;
      scaffolding.url = `/player/input?id=${playerId}`;
      const post = scaffolding.post(handler, res);
      const emit = Promise.resolve().then(() => {
        req.emitString(body);
        req.emitter.emit('end');
      });
      await Promise.all([emit, post]);
    }

    it('rejects input sent before the interval elapses', async () => {
      const handler = new PlayerInput(1000);
      player.inputRequestedAt = 5000;
      clock.millis = 5999;

      await send(handler, player.id, '}{');
      expect(res.statusCode).eq(statusCode.badRequest);
      expect(JSON.parse(res.content).id).eq(RESPONDING_TOO_QUICKLY);
    });

    it('a rejected input does not restart the interval', async () => {
      const handler = new PlayerInput(1000);
      player.inputRequestedAt = 5000;
      clock.millis = 5999;

      await send(handler, player.id, '}{');
      expect(JSON.parse(res.content).id).eq(RESPONDING_TOO_QUICKLY);

      clock.millis = 6000;
      await send(handler, player.id, '}{');
      expect(res.statusCode).eq(statusCode.badRequest);
      expect(JSON.parse(res.content).id).is.undefined;
    });

    it('processing an input restarts the interval', async () => {
      const handler = new PlayerInput(1000);
      player.inputRequestedAt = 5000;
      clock.millis = 6000;

      const response: OrOptionsResponse = {type: 'or', index: 1, response: {type: 'projectCard', card: CardName.POWER_PLANT_STANDARD_PROJECT, payment: Payment.of({megacredits: 11})}};
      await send(handler, player.id, JSON.stringify(response));
      expect(res.statusCode).eq(statusCode.ok);

      clock.millis = 6999;

      await send(handler, player.id, '}{');
      expect(res.statusCode).eq(statusCode.badRequest);
      expect(JSON.parse(res.content).id).eq(RESPONDING_TOO_QUICKLY);
    });

    it('does not limit input when the response interval is zero', async () => {
      const handler = new PlayerInput(0);

      await send(handler, player.id, '}{');
      expect(res.statusCode).eq(statusCode.badRequest);
      expect(JSON.parse(res.content).id).is.undefined;
    });

    it('records the time taken to respond to an input request', async () => {
      const handler = new PlayerInput(0);
      player.inputRequestedAt = 5000;
      clock.millis = 5300;

      await send(handler, player.id, '}{');

      const values = (await playerInputMetrics.responseInterval.get()).values;
      expect(values.find((v) => v.metricName === 'player_input_response_interval_count')?.value).eq(1);
      expect(values.find((v) => v.metricName === 'player_input_response_interval_sum')?.value).eq(300);
    });
  });
});
