import * as http from 'http';
import {expect} from 'chai';
import {ApiGames} from '../../src/routes/ApiGames';
import {Route} from '../../src/routes/Route';
import {Game} from '../../src/Game';
import {TestPlayers} from '../TestPlayers';
import {MockResponse} from './HttpMocks';
import {GameLoader} from '../../src/database/GameLoader';

describe('ApiGames', function() {
  beforeEach(() => {
    (GameLoader.getInstance() as unknown as any).games = new Map();
    (GameLoader.getInstance() as unknown as any).playerIds = new Map();
  });

  it('simple', () => {
    const req = {} as http.IncomingMessage;
    const res = new MockResponse();
    const ctx = {route: new Route(), serverId: '1', url: new URL('http://boo.com')};
    ApiGames.INSTANCE.get(req, res.hide(), ctx);
    expect(res.content).eq('[]');
  });

  it('a game', () => {
    const req = {} as http.IncomingMessage;
    const res = new MockResponse();
    const ctx = {route: new Route(), serverId: '1', url: new URL('http://boo.com')};
    const player = TestPlayers.BLACK.newPlayer();
    GameLoader.getInstance().add(Game.newInstance('game-id', [player], player));
    ApiGames.INSTANCE.get(req, res.hide(), ctx);
    expect(res.content).eq('["game-id"]');
  });
});
