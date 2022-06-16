import * as http from 'http';
import * as EventEmitter from 'events';
import {expect} from 'chai';
import {PlayerInput} from '../../src/routes/PlayerInput';
import {MockResponse} from './HttpMocks';
import {Game} from '../../src/Game';
import {TestPlayers} from '../TestPlayers';
import {OrOptions} from '../../src/inputs/OrOptions';
import {UndoActionOption} from '../../src/inputs/UndoActionOption';
import {RouteTestScaffolding} from './RouteTestScaffolding';

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
    await scaffolding.asyncPost(PlayerInput.INSTANCE, res);
    expect(res.content).eq('Bad request: must provide player id');
  });

  it('performs undo action', async () => {
    const player = TestPlayers.BLUE.newPlayer();
    scaffolding.url = '/player/input?id=' + player.id;
    player.beginner = true;
    const game = Game.newInstance('foo', [player], player);
    const undo = Game.newInstance('old', [player], player);
    scaffolding.ctx.gameLoader.add(game);
    game.gameOptions.undoOption = true;
    player.process([['1'], ['Power Plant:SP']]);
    const options = player.getWaitingFor() as OrOptions;
    options.options.push(new UndoActionOption());
    scaffolding.ctx.gameLoader.restoreGameAt = (_gameId: string, _lastSaveId: number) => Promise.resolve(undo);
    const post = scaffolding.asyncPost(PlayerInput.INSTANCE, res);
    req.emit('data', JSON.stringify([[String(options.options.length - 1)], ['']]));
    req.emit('end');
    try {
      await post;
    } catch (err) {
      console.log(err);
    }
    const model = JSON.parse(res.content);
    expect(game.gameAge).not.eq(undo.gameAge);
    expect(model.game.gameAge).eq(undo.gameAge);
  });

  it('reverts to current game instance if undo fails', async () => {
    const player = TestPlayers.BLUE.newPlayer();
    scaffolding.url = '/player/input?id=' + player.id;
    player.beginner = true;
    const game = Game.newInstance('foo', [player], player);
    const undo = Game.newInstance('old', [player], player);
    scaffolding.ctx.gameLoader.add(game);
    game.gameOptions.undoOption = true;
    player.process([['1'], ['Power Plant:SP']]);
    const options = player.getWaitingFor() as OrOptions;
    options.options.push(new UndoActionOption());
    scaffolding.ctx.gameLoader.restoreGameAt = (_gameId: string, _lastSaveId: number) => Promise.reject(new Error('error'));
    await scaffolding.asyncPost(PlayerInput.INSTANCE, res);
    scaffolding.req.emit('data', JSON.stringify([[String(options.options.length - 1)], ['']]));
    scaffolding.req.emit('end');
    const model = JSON.parse(res.content);
    expect(game.gameAge).not.eq(undo.gameAge);
    expect(model.game.gameAge).eq(model.game.gameAge);
  });

  it('sends 400 on server error', () => {
    const player = TestPlayers.BLUE.newPlayer();
    scaffolding.url = `/player/input?id=${player.id}`;
    const game = Game.newInstance('foo', [player], player);
    scaffolding.ctx.gameLoader.add(game);
    scaffolding.asyncPost(PlayerInput.INSTANCE, res);
    scaffolding.req.emit('data', '}{');
    scaffolding.req.emit('end');
    expect(res.content).eq('{"message":"Unexpected token } in JSON at position 0"}');
  });
});
