import {expect} from 'chai';
import {QuotaHandler} from '../../src/server/server/QuotaHandler';
import {Context} from '../../src/server/routes/IHandler';
import {IPTracker} from '../../src/server/server/IPTracker';
import {GameLoader} from '../../src/server/database/GameLoader';
import {FakeClock} from '../common/FakeClock';
import {ISessionManager} from '../../src/server/server/auth/SessionManager';
import {UrlParams} from '@/server/routes/UrlParams';

describe('QuotaHandler', () => {
  let ctx: Context;
  let fakeClock: FakeClock;

  beforeEach(() => {
    fakeClock = new FakeClock;
    const url = new URL('http://boo.com');
    ctx = {
      url: url,
      ip: '123.45.678.90',
      ipTracker: {} as IPTracker,
      gameLoader: {} as GameLoader,
      sessionManager: {} as ISessionManager,
      ids: {
        serverId: '1',
        statsId: '2',
      },
      clock: fakeClock,
      urlParams: new UrlParams(url.searchParams),
    };
  });

  it('sanity', () => {
    const quotaHandler = new QuotaHandler({limit: 5, perMs: 120_000});
    expect(quotaHandler.measure(ctx)).is.true;
    fakeClock.millis += 100;
    expect(quotaHandler.measure(ctx)).is.true;
    fakeClock.millis += 100;
    expect(quotaHandler.measure(ctx)).is.true;
    fakeClock.millis += 100;
    expect(quotaHandler.measure(ctx)).is.true;
    fakeClock.millis += 100;
    expect(quotaHandler.measure(ctx)).is.true;
    fakeClock.millis += 100;
    expect(quotaHandler.measure(ctx)).is.false;
    fakeClock.millis += 100;
    expect(quotaHandler.measure(ctx)).is.false;
    fakeClock.millis += 150_000;
    expect(quotaHandler.measure(ctx)).is.true;
  });
});
