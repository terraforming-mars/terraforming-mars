import * as http from 'http';
import * as EventEmitter from 'events';
import {expect} from 'chai';
import {PlayerInput} from '../../src/server/routes/PlayerInput';
import {MockResponse} from './HttpMocks';
import {Game} from '../../src/server/Game';
import {TestPlayer} from '../TestPlayer';
import {OrOptions} from '../../src/server/inputs/OrOptions';
import {UndoActionOption} from '../../src/server/inputs/UndoActionOption';
import {RouteTestScaffolding} from './RouteTestScaffolding';
import {cast} from '../TestingUtils';

describe('PlayerInput', function() {
  let scaffolding: RouteTestScaffolding;
  let req: EventEmitter;
  let res: MockResponse;

  beforeEach(() => {
    req = new EventEmitter();
    res = new MockResponse();
    scaffolding = new RouteTestScaffolding(req as http.IncomingMessage);
  });

  it('fails when id not provided', async () => {
    scaffolding.url = '/player/input';
    await scaffolding.post(PlayerInput.INSTANCE, res);
    expect(res.content).eq('Bad request: missing id parameter');
  });

  it('performs undo action', async () => {
    const player = TestPlayer.BLUE.newPlayer(/* beginner= */ true);
    scaffolding.url = '/player/input?id=' + player.id;
    const game = Game.newInstance('gameid-foo', [player], player);

    const undoVersionOfPlayer = TestPlayer.BLUE.newPlayer(/* beginner= */ true);
    const undo = Game.newInstance('gameid-old', [undoVersionOfPlayer], undoVersionOfPlayer);

    await scaffolding.ctx.gameLoader.add(game);

    player.process([['1'], ['Power Plant:SP']]);
    const options = cast(player.getWaitingFor(), OrOptions);
    options.options.push(new UndoActionOption());
    scaffolding.ctx.gameLoader.restoreGameAt = (_gameId: string, _lastSaveId: number) => Promise.resolve(undo);

    const post = scaffolding.post(PlayerInput.INSTANCE, res);
    const emit = Promise.resolve().then(() => {
      req.emit('data', JSON.stringify([[String(options.options.length - 1)], ['']]));
      req.emit('end');
    });
    await Promise.all(([emit, post]));

    const model = JSON.parse(res.content);
    expect(game.gameAge).not.eq(undo.gameAge);
    expect(model.game.gameAge).eq(undo.gameAge);
  });

  it('reverts to current game instance if undo fails', async () => {
    const player = TestPlayer.BLUE.newPlayer(/* beginner= */ true);
    scaffolding.url = '/player/input?id=' + player.id;
    const game = Game.newInstance('gameid-foo', [player], player);

    const undoVersionOfPlayer = TestPlayer.BLUE.newPlayer(/* beginner= */ true);
    const undo = Game.newInstance('gameid-old', [undoVersionOfPlayer], undoVersionOfPlayer);

    await scaffolding.ctx.gameLoader.add(game);

    player.process([['1'], ['Power Plant:SP']]);
    const options = cast(player.getWaitingFor(), OrOptions);
    options.options.push(new UndoActionOption());
    scaffolding.ctx.gameLoader.restoreGameAt = (_gameId: string, _lastSaveId: number) => Promise.reject(new Error('error'));

    const post = scaffolding.post(PlayerInput.INSTANCE, res);
    const emit = Promise.resolve().then(() => {
      scaffolding.req.emit('data', JSON.stringify([[String(options.options.length - 1)], ['']]));
      scaffolding.req.emit('end');
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
      scaffolding.req.emit('data', '}{');
      scaffolding.req.emit('end');
    });
    await Promise.all(([emit, post]));

    expect(res.content).eq('{"message":"Unexpected token } in JSON at position 0"}');
  });
});
