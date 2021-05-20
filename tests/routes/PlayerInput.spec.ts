import * as http from 'http';
import * as EventEmitter from 'events';
import {expect} from 'chai';
import {PlayerInput} from '../../src/routes/PlayerInput';
import {Route} from '../../src/routes/Route';
import {MockResponse} from './HttpMocks';
import {IContext} from '../../src/routes/IHandler';
import {Game} from '../../src/Game';
import {FakeGameLoader} from './FakeGameLoader';
import {TestPlayers} from '../TestPlayers';
import {OrOptions} from '../../src/inputs/OrOptions';
import {UndoActionOption} from '../../src/inputs/UndoActionOption';

describe('PlayerInput', function() {
  let req: http.IncomingMessage;
  let res: MockResponse;
  let ctx: IContext;

  beforeEach(() => {
    req = new EventEmitter() as http.IncomingMessage;
    res = new MockResponse();
    ctx = {
      route: new Route(),
      serverId: '1',
      url: new URL('http://boo.com'),
      gameLoader: new FakeGameLoader(),
    };
  });

  it('fails when id not provided', () => {
    req.url = '/player/input';
    ctx.url = new URL('http://boo.com' + req.url);
    PlayerInput.INSTANCE.post(req, res.hide(), ctx);
    expect(res.content).eq('Bad request: must provide id');
  });

  it('performs undo action', () => {
    const player = TestPlayers.BLUE.newPlayer();
    req.url = '/player/input?id=' + player.id;
    ctx.url = new URL('http://boo.com' + req.url);
    player.beginner = true;
    const game = Game.newInstance('foo', [player], player);
    const undo = Game.newInstance('old', [player], player);
    ctx.gameLoader.add(game);
    game.gameOptions.undoOption = true;
    player.process([['1'], ['Power Plant:SP']]);
    const options = player.getWaitingFor() as OrOptions;
    options.options.push(new UndoActionOption());
    ctx.gameLoader.restoreGameAt = function(_gameId: string, _lastSaveId: number, cb: (game: Game | undefined) => void) {
      cb(undo);
    };
    PlayerInput.INSTANCE.post(req, res.hide(), ctx);
    req.emit('data', JSON.stringify([[String(options.options.length - 1)], ['']]));
    req.emit('end');
    const model = JSON.parse(res.content);
    expect(game.gameAge).not.eq(undo.gameAge);
    expect(model.game.gameAge).eq(undo.gameAge);
  });

  it('reverts to current game instance if undo fails', () => {
    const player = TestPlayers.BLUE.newPlayer();
    req.url = '/player/input?id=' + player.id;
    ctx.url = new URL('http://boo.com' + req.url);
    player.beginner = true;
    const game = Game.newInstance('foo', [player], player);
    const undo = Game.newInstance('old', [player], player);
    ctx.gameLoader.add(game);
    game.gameOptions.undoOption = true;
    player.process([['1'], ['Power Plant:SP']]);
    const options = player.getWaitingFor() as OrOptions;
    options.options.push(new UndoActionOption());
    ctx.gameLoader.restoreGameAt = function(_gameId: string, _lastSaveId: number, cb: (game: Game | undefined) => void) {
      cb(undefined);
    };
    PlayerInput.INSTANCE.post(req, res.hide(), ctx);
    req.emit('data', JSON.stringify([[String(options.options.length - 1)], ['']]));
    req.emit('end');
    const model = JSON.parse(res.content);
    expect(game.gameAge).not.eq(undo.gameAge);
    expect(model.game.gameAge).eq(model.game.gameAge);
  });

  it('sends 400 on server error', () => {
    const player = TestPlayers.BLUE.newPlayer();
    req.url = '/player/input?id=' + player.id;
    ctx.url = new URL('http://boo.com' + req.url);
    const game = Game.newInstance('foo', [player], player);
    ctx.gameLoader.add(game);
    PlayerInput.INSTANCE.post(req, res.hide(), ctx);
    req.emit('data', '}{');
    req.emit('end');
    expect(res.content).eq('{"message":"Unexpected token } in JSON at position 0"}');
  });
});
