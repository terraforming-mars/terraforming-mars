import {expect} from 'chai';
import {metricsPathOf, processRequest} from '../../src/server/server/requestProcessor';
import {MockRequest, MockResponse} from '../routes/HttpMocks';

describe('requestProcessor', () => {
  it('routes a request from an allowed IP to a handler', async () => {
    // The default MockRequest socket address (127.0.0.1) is not on the blocklist.
    const req = new MockRequest();
    const res = new MockResponse();
    req.url = '/';
    await processRequest(req, res);

    expect(req.url).eq('/build/index.html');
  });

  it('keeps metrics labels stable across Vite builds', () => {
    expect(metricsPathOf('main-AbCd1234.js')).eq('main.js');
    expect(metricsPathOf('client-AbCd1234.css')).eq('client.css');
    expect(metricsPathOf('chunks/PlayerHome-AbCd1234.js')).eq('chunks/PlayerHome.js');
    expect(metricsPathOf('chunks/player-home-AbCd1234.js.map')).eq('chunks/player-home.js.map');
    expect(metricsPathOf('assets/PlayerHome-AbCd1234.png')).eq('assets/');
    expect(metricsPathOf('api/player')).eq('api/player');
  });

  it('waits for the routed handler to finish writing the response before returning', async () => {
    // ServeAsset reads the file asynchronously, so this exercises a handler
    // that suspends on a real await before writing headers/body.
    const req = new MockRequest();
    const res = new MockResponse();
    req.url = '/';

    await processRequest(req, res);

    expect(res.content.length).greaterThan(0);
    expect(res.getHeader('Content-Length')).eq(res.content.length);
  });
});
