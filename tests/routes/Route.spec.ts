import * as http from 'http';
import {expect} from 'chai';
import {Route} from '../../src/routes/Route';
import {FakeGameLoader} from './FakeGameLoader';
import {MockResponse} from './HttpMocks';
import {IContext} from '../../src/routes/IHandler';

describe('Route', () => {
  let instance: Route;
  let req: http.IncomingMessage;
  let res: MockResponse;
  let ctx: IContext;

  // Strictly speaking |parameters| can also accept a fragment.
  const setRequest = function(parameters: string, headers: Array<Array<string>> = []) {
    req.url = parameters;
    ctx.url = new URL('http://boo.com' + parameters);
    headers.forEach((entry) => {
      req.headers[entry[0]] = entry[1];
    });
  };

  beforeEach(() => {
    instance = new Route();
    req = {headers: {}} as http.IncomingMessage;
    res = new MockResponse();
    ctx = {
      route: new Route(),
      serverId: '1',
      url: new URL('http://boo.com'),
      gameLoader: new FakeGameLoader(),
    };
  });

  it('internalServerError expects predictable errors', () => {
    setRequest('goo.goo.gaa.gaa', [['accept-encoding', '']]);
    instance.internalServerError(req, res.hide(), {'<img src=x onerror=alert(1)>': 'foo'});
    expect(res.statusCode).eq(500);
    expect(res.content).eq('Internal server error: unknown error');
  });

  it('internalServerError prevents xss', () => {
    setRequest('goo.goo.gaa.gaa', [['accept-encoding', '']]);
    instance.internalServerError(req, res.hide(), '<img src=x onerror=alert(1)>');
    expect(res.statusCode).eq(500);
    expect(res.content).eq('Internal server error: &lt;img src=x onerror=alert(1)&gt;');
  });
});
