import * as http from 'http';
import {expect} from 'chai';
import {ServeAsset} from '../../src/routes/ServeAsset';
import {Route} from '../../src/routes/Route';
import {FakeGameLoader} from './FakeGameLoader';
import {MockResponse} from './HttpMocks';
import {IContext} from '../../src/routes/IHandler';

describe('ServeAsset', () => {
  let instance: ServeAsset;
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
    instance = new ServeAsset(undefined, false);
    req = {headers: {}} as http.IncomingMessage;
    res = new MockResponse();
    ctx = {
      route: new Route(),
      serverId: '1',
      url: new URL('http://boo.com'),
      gameLoader: new FakeGameLoader(),
    };
  });

  it('bad filename', () => {
    setRequest('goo.goo.gaa.gaa', [['accept-encoding', '']]);
    instance.get(req, res.hide(), ctx);
    expect(res.statusCode).eq(404);
    expect(res.content).eq('Not found');
  });

  it('index.html', () => {
    setRequest('/assets/index.html', [['accept-encoding', '']]);
    instance.get(req, res.hide(), ctx);
    expect(res.content.startsWith('<!DOCTYPE html>'));
  });
});
