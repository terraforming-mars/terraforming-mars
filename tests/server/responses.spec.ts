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
});
