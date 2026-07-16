import {Context} from '../../src/server/routes/IHandler';
import {Handler} from '../../src/server/routes/Handler';
import {FakeGameLoader} from './FakeGameLoader';
import {FakeSessionManager} from './FakeSessionManager';
import {MockRequest, MockResponse} from './HttpMocks';
import {newIpTracker} from '../../src/server/server/IPTracker';
import {FakeClock} from '../common/FakeClock';

export type Header = 'accept-encoding';

// Reusable components for testing routes.
export class RouteTestScaffolding {
  public ctx: Context;

  constructor(public req: MockRequest = new MockRequest()) {
    this.ctx = {
      url: new URL('http://boo.com'),
      ip: '123.45.678.90',
      ipTracker: newIpTracker(),
      gameLoader: new FakeGameLoader(),
      sessionManager: new FakeSessionManager(),
      ids: {
        serverId: '1',
        statsId: '2',
      },
      clock: new FakeClock(),
    };
    if (!this.req.headers) this.req.headers = {};
  }

  // Strictly speaking |url| can also accept a fragment.
  public set url(headlessUri: string) {
    this.req.url = headlessUri;
    this.ctx.url = new URL('http://boo.com' + headlessUri);
  }

  public get(handler: Handler, res: MockResponse): Promise<void> {
    return handler.get(this.req, res, this.ctx);
  }

  public post(handler: Handler, res: MockResponse) {
    return handler.post(this.req, res, this.ctx);
  }

  public put(handler: Handler, res: MockResponse) {
    return handler.put(this.req, res, this.ctx);
  }
}
