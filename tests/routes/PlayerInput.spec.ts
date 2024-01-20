import {expect} from 'chai';
import {PlayerInput} from '../../src/server/routes/PlayerInput';
import {MockRequest, MockResponse} from './HttpMocks';
import {Game} from '../../src/server/Game';
import {TestPlayer} from '../TestPlayer';
import {OrOptions} from '../../src/server/inputs/OrOptions';
import {UndoActionOption} from '../../src/server/inputs/UndoActionOption';
import {RouteTestScaffolding} from './RouteTestScaffolding';
import {cast} from '../TestingUtils';
import {OrOptionsResponse} from '../../src/common/inputs/InputResponse';
import {CardName} from '../../src/common/cards/CardName';

describe('PlayerInput', function() {
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
    expect(res.content).eq('Bad request: missing id parameter');
  });

  it('performs undo action', async () => {
    const player = TestPlayer.BLUE.newPlayer({beginner: true});
    scaffolding.url = '/player/input?id=' + player.id;
    const game = Game.newInstance('gameid-foo', [player], player);

    const undoVersionOfPlayer = TestPlayer.BLUE.newPlayer({beginner: true});
    const undo = Game.newInstance('gameid-old', [undoVersionOfPlayer], undoVersionOfPlayer);

    await scaffolding.ctx.gameLoader.add(game);

    player.process({type: 'or', index: 1, response: {type: 'card', cards: [CardName.POWER_PLANT_STANDARD_PROJECT]}});
    const options = cast(player.getWaitingFor(), OrOptions);
    options.options.push(new UndoActionOption());
    scaffolding.ctx.gameLoader.restoreGameAt = (_gameId: string, _lastSaveId: number) => Promise.resolve(undo);

    const post = scaffolding.post(PlayerInput.INSTANCE, res);
    const emit = Promise.resolve().then(() => {
      const orOptionsResponse: OrOptionsResponse = {type: 'or', index: options.options.length - 1, response: {type: 'option'}};
      req.emitter.emit('data', JSON.stringify(orOptionsResponse));
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
    const game = Game.newInstance('gameid-foo', [player], player);

    const undoVersionOfPlayer = TestPlayer.BLUE.newPlayer({beginner: true});
    const undo = Game.newInstance('gameid-old', [undoVersionOfPlayer], undoVersionOfPlayer);

    await scaffolding.ctx.gameLoader.add(game);

    player.process(<OrOptionsResponse>{type: 'or', index: 1, response: {type: 'card', cards: [CardName.POWER_PLANT_STANDARD_PROJECT]}});
    const options = cast(player.getWaitingFor(), OrOptions);
    options.options.push(new UndoActionOption());
    scaffolding.ctx.gameLoader.restoreGameAt = (_gameId: string, _lastSaveId: number) => Promise.reject(new Error('error'));

    const post = scaffolding.post(PlayerInput.INSTANCE, res);
    const emit = Promise.resolve().then(() => {
      const orOptionsResponse: OrOptionsResponse = {type: 'or', index: options.options.length - 1, response: {type: 'option'}};
      scaffolding.req.emitter.emit('data', JSON.stringify(orOptionsResponse));
      scaffolding.req.emitter.emit('end');
    });
    await Promise.all(([emit, post]));

    const model = JSON.parse(res.content);
    expect(game.gameAge).not.eq(undo.gameAge);
    expect(model.game.gameAge).eq(model.game.gameAge);
  });

  it('sends 400 on server error', async () => {
    const player = TestPlayer.BLUE.newPlayer();
    scaffolding.url = `/player/input?id=${player.id}`;
    const game = Game.newInstance('gameid', [player], player);
    await scaffolding.ctx.gameLoader.add(game);

    const post = scaffolding.post(PlayerInput.INSTANCE, res);
    const emit = Promise.resolve().then(() => {
      scaffolding.req.emitter.emit('data', '}{');
      scaffolding.req.emitter.emit('end');
    });
    await Promise.all(([emit, post]));

    expect(res.content).matches(/Unexpected token/);
  });
});
