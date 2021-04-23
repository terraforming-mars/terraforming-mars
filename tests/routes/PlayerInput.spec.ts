import * as http from 'http';
import {expect} from 'chai';
import {PlayerInput} from '../../src/routes/PlayerInput';
import {Route} from '../../src/routes/Route';
import {MockResponse} from './HttpMocks';
import {IContext} from '../../src/routes/IHandler';
import {FakeGameLoader} from './FakeGameLoader';

describe('PlayerInput', function() {
  let req: http.IncomingMessage;
  let res: MockResponse;
  let ctx: IContext;

  beforeEach(() => {
    req = {} as http.IncomingMessage;
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
});
