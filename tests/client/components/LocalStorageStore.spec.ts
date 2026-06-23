import {expect} from 'chai';
import {LocalStorageStore} from '@/client/utils/LocalStorageStore';
import {safeLocalStorage} from '@/client/utils/SafeLocalStorage';
import {FakeLocalStorage} from './FakeLocalStorage';

describe('LocalStorageStore', () => {
  let localStorage: FakeLocalStorage;

  beforeEach(() => {
    localStorage = new FakeLocalStorage();
    FakeLocalStorage.register(localStorage);
  });

  afterEach(() => {
    FakeLocalStorage.deregister(localStorage);
  });

  it('round-trips typed values under a prefix', () => {
    const store = new LocalStorageStore<{n: number}>({prefix: 'thing:'});
    store.set('a', {n: 5});
    expect(store.get('a')).to.deep.eq({n: 5});
    expect(safeLocalStorage.getItem('thing:a')).to.not.be.null;
    store.remove('a');
    expect(store.get('a')).to.be.undefined;
  });

  it('returns undefined for missing or other-prefix keys', () => {
    safeLocalStorage.setItem('other:a', 'whatever');
    const store = new LocalStorageStore<number>({prefix: 'mine:'});
    expect(store.get('a')).to.be.undefined;
  });

  it('expires entries past their ttl', () => {
    const store = new LocalStorageStore<number>({prefix: 'ttl:', ttlMs: 1000});
    store.set('a', 1);
    // Rewrite with an expiry in the past.
    safeLocalStorage.setItem('ttl:a', JSON.stringify({v: 1, e: Date.now() - 1}));
    expect(store.get('a')).to.be.undefined;
  });

  it('sweeps expired entries when created', () => {
    safeLocalStorage.setItem('swept:old', JSON.stringify({v: 1, e: Date.now() - 1}));
    safeLocalStorage.setItem('swept:new', JSON.stringify({v: 2, e: Date.now() + 100000}));
    new LocalStorageStore<number>({prefix: 'swept:', ttlMs: 1000});
    expect(safeLocalStorage.getItem('swept:old')).to.be.null;
    expect(safeLocalStorage.getItem('swept:new')).to.not.be.null;
  });

  it('migrates legacy (non-envelope) values forward instead of dropping them', () => {
    // A pre-envelope value: the bare payload, no {v, e} wrapper.
    safeLocalStorage.setItem('mig:a', JSON.stringify({legacy: true}));
    const store = new LocalStorageStore<{legacy: boolean}>({
      prefix: 'mig:',
      ttlMs: 1000,
      migrate: (raw) => JSON.parse(raw),
    });
    // Not deleted, and rewritten in envelope form with a fresh expiry.
    const raw = safeLocalStorage.getItem('mig:a');
    expect(raw).to.not.be.null;
    const stored = JSON.parse(raw!);
    expect(stored.v).to.deep.eq({legacy: true});
    expect(stored.e).to.be.a('number');
    expect(store.get('a')).to.deep.eq({legacy: true});
  });

  it('drops unrecoverable entries when no migrate is supplied', () => {
    safeLocalStorage.setItem('drop:a', 'not json at all');
    new LocalStorageStore<number>({prefix: 'drop:', ttlMs: 1000});
    expect(safeLocalStorage.getItem('drop:a')).to.be.null;
  });

  it('serves cached reads from the in-memory mirror loaded at creation', () => {
    safeLocalStorage.setItem('c:a', JSON.stringify({v: 7, e: Date.now() + 100000}));
    const store = new LocalStorageStore<number>({prefix: 'c:', ttlMs: 1000, cached: true});
    expect(store.get('a')).to.eq(7);
    // A write that bypasses the store is not seen by the mirror.
    safeLocalStorage.setItem('c:a', JSON.stringify({v: 99, e: Date.now() + 100000}));
    expect(store.get('a')).to.eq(7);
    // But writes through the store are.
    store.set('a', 42);
    expect(store.get('a')).to.eq(42);
  });
});
