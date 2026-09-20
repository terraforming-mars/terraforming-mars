import {expect} from 'chai';
import {LoadGame} from '../../src/server/routes/LoadGame';
import {MockRequest, MockResponse} from './HttpMocks';
import {RouteTestScaffolding} from './RouteTestScaffolding';
import {SimpleGameModel} from '../../src/common/models/SimpleGameModel';
import {statusCode} from '@/common/http/statusCode';
import {testGame} from '@tests/TestGame';

describe('LoadGame', () => {
  let scaffolding: RouteTestScaffolding;
  let req: MockRequest;
  let res: MockResponse;

  beforeEach(() => {
    req = new MockRequest();
    res = new MockResponse();
    scaffolding = new RouteTestScaffolding(req);
  });

  // gameId is a raw string here: the wire carries whatever the client sent, which is
  // what getGameId exists to reject.
  type Form = {gameId: string, rollbackCount: number};

  // The route reads the request body off the 'data'/'end' events, so the body has to be
  // emitted after put() is called but before it is awaited.
  function put(form: Form): Promise<unknown> {
    const response = scaffolding.put(LoadGame.INSTANCE, res);
    const emit = Promise.resolve().then(() => {
      req.emitString(JSON.stringify(form));
      req.emitter.emit('end');
    });
    return Promise.all([emit, response]);
  }

  it('no get', async () => {
    await scaffolding.get(LoadGame.INSTANCE, res);
    expect(res.statusCode).eq(statusCode.notFound);
    expect(res.content).eq('Not found');
  });

  it('fails with invalid game id', async () => {
    await put({gameId: 'not-a-game-id', rollbackCount: 0});
    expect(res.statusCode).eq(statusCode.notFound);
    expect(res.content).eq('Not found: Invalid game id');
  });

  it('fails when game is not in the database', async () => {
    await put({gameId: 'g-unknown', rollbackCount: 0});
    expect(res.statusCode).eq(statusCode.notFound);
    expect(res.content).eq('Not found: game_id not found');
  });

  it('fails when the body is not valid json', async () => {
    const response = scaffolding.put(LoadGame.INSTANCE, res);
    const emit = Promise.resolve().then(() => {
      req.emitString('}{');
      req.emitter.emit('end');
    });
    await Promise.all([emit, response]);
    expect(res.statusCode).eq(statusCode.internalServerError);
    expect(res.content).to.match(/^Internal server error: /);
    expect(res.content).to.match(/not valid JSON/);
  });

  it('loads the game', async () => {
    const [game] = testGame(2);
    await scaffolding.ctx.gameLoader.add(game);
    await put({gameId: game.id, rollbackCount: 0});
    expect(res.statusCode).eq(statusCode.ok);
    expect(res.headers.get('Content-Type')).eq('application/json');
    const model = JSON.parse(res.content) as SimpleGameModel;
    expect(model.id).eq(game.id);
  });
});
