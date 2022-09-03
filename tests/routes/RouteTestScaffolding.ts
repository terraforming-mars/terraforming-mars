import * as http from 'http';
import {Context} from '../../src/server/routes/IHandler';
import {Handler} from '../../src/server/routes/Handler';
import {Route} from '../../src/server/routes/Route';
import {FakeGameLoader} from './FakeGameLoader';
import {MockResponse} from './HttpMocks';

export type Header = 'accept-encoding';

// Reusable components for testing routes.
export class RouteTestScaffolding {
  public req: http.IncomingMessage;
  public ctx: Context;

  constructor(req: Partial<http.IncomingMessage> = {}) {
    this.req = req as http.IncomingMessage;
    this.ctx = {
      route: new Route(),
      serverId: '1',
      url: new URL('http://boo.com'),
      gameLoader: new FakeGameLoader(),
    };
    if (!this.req.headers) this.req.headers = {};
  }

  // Strictly speaking |url| can also accept a fragment.
  public set url(headlessUri: string) {
    this.req.url = headlessUri;
    this.ctx.url = new URL('http://boo.com' + headlessUri);
  }

  public get(handler: Handler, res: MockResponse): Promise<void> {
    return handler.get(this.req, res.hide(), this.ctx);
  }

  public post(handler: Handler, res: MockResponse) {
    return handler.post(this.req, res.hide(), this.ctx);
  }
}
