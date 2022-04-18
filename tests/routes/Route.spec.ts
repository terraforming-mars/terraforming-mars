import {expect} from 'chai';
import {Route} from '../../src/routes/Route';
import {MockResponse} from './HttpMocks';
import {RouteTestScaffolding} from './RouteTestScaffolding';

describe('Route', () => {
  let instance: Route;
  let scaffolding: RouteTestScaffolding;
  let res: MockResponse;

  beforeEach(() => {
    instance = new Route();
    scaffolding = new RouteTestScaffolding();
    res = new MockResponse();
  });

  it('internalServerError expects predictable errors', () => {
    scaffolding.url = 'goo.goo.gaa.gaa';
    scaffolding.req.headers['accept-encoding'] = '';
    instance.internalServerError(scaffolding.req, res.hide(), {'<img src=x onerror=alert(1)>': 'foo'});
    expect(res.statusCode).eq(500);
    expect(res.content).eq('Internal server error: unknown error');
  });

  it('internalServerError prevents xss', () => {
    scaffolding.url = 'goo.goo.gaa.gaa';
    scaffolding.req.headers['accept-encoding'] = '';
    instance.internalServerError(scaffolding.req, res.hide(), '<img src=x onerror=alert(1)>');
    expect(res.statusCode).eq(500);
    expect(res.content).eq('Internal server error: &lt;img src=x onerror=alert(1)&gt;');
  });
});
