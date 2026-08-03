import {expect} from 'chai';
import {ThrottledCache} from '../../src/server/database/ThrottledCache';
import {FakeClock} from '../common/FakeClock';

function flushPromises(): Promise<void> {
  return new Promise((resolve) => setImmediate(resolve));
}

describe('ThrottledCache', () => {
  let fakeClock: FakeClock;

  beforeEach(() => {
    fakeClock = new FakeClock();
  });

  it('returns undefined until the first operation resolves', async () => {
    const cache = new ThrottledCache<number>(fakeClock, 1000, async () => 42);
    expect(cache.get()).to.be.undefined;
    await flushPromises();
    expect(cache.get()).to.eq(42);
  });

  it('does not call operation again before the interval elapses', async () => {
    let calls = 0;
    const cache = new ThrottledCache<number>(fakeClock, 1000, async () => ++calls);
    cache.get();
    await flushPromises();
    expect(cache.get()).to.eq(1);

    fakeClock.millis += 999;
    expect(cache.get()).to.eq(1);
    expect(calls).to.eq(1);
  });

  it('calls operation again once the interval elapses', async () => {
    let calls = 0;
    const cache = new ThrottledCache<number>(fakeClock, 1000, async () => ++calls);
    cache.get();
    await flushPromises();
    expect(cache.get()).to.eq(1);

    fakeClock.millis += 1000;
    cache.get();
    await flushPromises();
    expect(cache.get()).to.eq(2);
    expect(calls).to.eq(2);
  });

  it('does not call operation twice for concurrent get() calls while one is in flight', async () => {
    let calls = 0;
    const cache = new ThrottledCache<number>(fakeClock, 1000, async () => ++calls);
    cache.get();
    cache.get();
    cache.get();
    await flushPromises();
    expect(calls).to.eq(1);
  });

  it('keeps serving the last good value when a later attempt fails', async () => {
    let shouldFail = false;
    const cache = new ThrottledCache<number>(fakeClock, 1000, async () => {
      if (shouldFail) {
        throw new Error('boom');
      }
      return 7;
    });
    cache.get();
    await flushPromises();
    expect(cache.get()).to.eq(7);

    shouldFail = true;
    fakeClock.millis += 1000;
    cache.get();
    await flushPromises();
    expect(cache.get()).to.eq(7);
  });

  it('throttles retries after a failure, not just after a success', async () => {
    let calls = 0;
    const cache = new ThrottledCache<number>(fakeClock, 1000, async () => {
      calls++;
      throw new Error('boom');
    });
    cache.get();
    await flushPromises();
    expect(calls).to.eq(1);
    expect(cache.get()).to.be.undefined;

    // Before the interval elapses, a failed attempt must not retry immediately.
    cache.get();
    await flushPromises();
    expect(calls).to.eq(1);

    fakeClock.millis += 1000;
    cache.get();
    await flushPromises();
    expect(calls).to.eq(2);
  });

  it('throttles correctly when T is void, where success also yields undefined', async () => {
    let calls = 0;
    const cache = new ThrottledCache<void>(fakeClock, 1000, async () => {
      calls++;
    });
    cache.get();
    await flushPromises();
    expect(calls).to.eq(1);

    cache.get();
    cache.get();
    await flushPromises();
    expect(calls).to.eq(1);

    fakeClock.millis += 1000;
    cache.get();
    await flushPromises();
    expect(calls).to.eq(2);
  });
});
