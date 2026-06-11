import {expect} from 'chai';
import {processRequest} from '../../src/server/server/requestProcessor';
import {MockRequest, MockResponse} from '../routes/HttpMocks';

describe('requestProcessor', () => {
  it('routes a request from an allowed IP to a handler', () => {
    // The default MockRequest socket address (127.0.0.1) is not on the blocklist.
    const req = new MockRequest();
    const res = new MockResponse();
    req.url = '/';
    processRequest(req, res);

    expect(req.url).eq('/assets/index.html');
  });
});
