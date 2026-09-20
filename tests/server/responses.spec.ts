import {expect} from 'chai';
import * as responses from '../../src/server/server/responses';
import {MockResponse} from '../routes/HttpMocks';
import {RouteTestScaffolding} from '../routes/RouteTestScaffolding';
import {statusCode} from '../../src/common/http/statusCode';

describe('Route', () => {
  let scaffolding: RouteTestScaffolding;
  let res: MockResponse;

  beforeEach(() => {
    scaffolding = new RouteTestScaffolding();
    res = new MockResponse();
  });

  it('internalServerError expects predictable errors', () => {
    scaffolding.url = 'goo.goo.gaa.gaa';
    scaffolding.req.headers['accept-encoding'] = '';
    responses.internalServerError(scaffolding.req, res, {'<img src=x onerror=alert(1)>': 'foo'});
    expect(res.statusCode).eq(statusCode.internalServerError);
    expect(res.content).eq('Internal server error: unknown error');
  });

  it('internalServerError prevents xss', () => {
    scaffolding.url = 'goo.goo.gaa.gaa';
    scaffolding.req.headers['accept-encoding'] = '';
    responses.internalServerError(scaffolding.req, res, '<img src=x onerror=alert(1)>');
    expect(res.statusCode).eq(statusCode.internalServerError);
    expect(res.content).eq('Internal server error: &lt;img src=x onerror=alert(1)&gt;');
  });

  it('writeJson sets Content-Length to the byte length of the body', () => {
    responses.writeJson(res, scaffolding.ctx, {foo: 'bar'});
    expect(res.getHeader('Content-Length')).eq(Buffer.byteLength(res.content));
  });

  it('writeJson sets Content-Length by byte length, not string length', () => {
    // A multi-byte character makes byte length diverge from string length,
    // guarding against a regression back to using `s.length`.
    responses.writeJson(res, scaffolding.ctx, {name: '🚀'});
    expect(res.getHeader('Content-Length')).eq(Buffer.byteLength(res.content));
    expect(res.getHeader('Content-Length')).not.eq(res.content.length);
  });
});
