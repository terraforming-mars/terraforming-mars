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
  let res: MockResponse;

  beforeEach(() => {
    scaffolding = new RouteTestScaffolding(new EventEmitter() as http.IncomingMessage);
    res = new MockResponse();
  });

  it('fails when id not provided', () => {
    scaffolding.url = '/player/input';
    scaffolding.post(PlayerInput.INSTANCE, res);
    expect(res.content).eq('Bad request: must provide player id');
  });

  it('performs undo action', () => {
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
    scaffolding.ctx.gameLoader.restoreGameAt = function(_gameId: string, _lastSaveId: number, cb: (game: Game | undefined) => void) {
      cb(undo);
    };
    scaffolding.post(PlayerInput.INSTANCE, res);
    scaffolding.req.emit('data', JSON.stringify([[String(options.options.length - 1)], ['']]));
    scaffolding.req.emit('end');
    const model = JSON.parse(res.content);
    expect(game.gameAge).not.eq(undo.gameAge);
    expect(model.game.gameAge).eq(undo.gameAge);
  });

  it('reverts to current game instance if undo fails', () => {
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
    scaffolding.ctx.gameLoader.restoreGameAt = function(_gameId: string, _lastSaveId: number, cb: (game: Game | undefined) => void) {
      cb(undefined);
    };
    scaffolding.post(PlayerInput.INSTANCE, res);
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
    scaffolding.post(PlayerInput.INSTANCE, res);
    scaffolding.req.emit('data', '}{');
    scaffolding.req.emit('end');
    expect(res.content).eq('{"message":"Unexpected token } in JSON at position 0"}');
  });
});
