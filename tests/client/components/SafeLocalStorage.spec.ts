import {expect} from 'chai';
import {safeLocalStorage} from '@/client/utils/SafeLocalStorage';
import {FakeLocalStorage} from './FakeLocalStorage';

describe('SafeLocalStorage', () => {
  let localStorage: FakeLocalStorage;

  beforeEach(() => {
    localStorage = new FakeLocalStorage();
    FakeLocalStorage.register(localStorage);
  });

  afterEach(() => {
    FakeLocalStorage.deregister(localStorage);
  });

  it('round-trips values', () => {
    safeLocalStorage.setItem('a', '1');
    expect(safeLocalStorage.getItem('a')).to.eq('1');
    safeLocalStorage.removeItem('a');
    expect(safeLocalStorage.getItem('a')).to.be.null;
  });

  it('getItem returns null for missing keys', () => {
    expect(safeLocalStorage.getItem('missing')).to.be.null;
  });

  it('keys() returns all keys', () => {
    safeLocalStorage.setItem('a', '1');
    safeLocalStorage.setItem('b', '2');
    expect(safeLocalStorage.keys().sort()).to.deep.eq(['a', 'b']);
  });

  it('fails soft when storage throws', () => {
    const throwing = {
      getItem() {
        throw new Error('denied');
      },
      setItem() {
        throw new Error('denied');
      },
      removeItem() {
        throw new Error('denied');
      },
      get length(): number {
        throw new Error('denied');
      },
      key() {
        throw new Error('denied');
      },
    };
    (global as any).localStorage = throwing;

    // None of these should throw.
    expect(() => safeLocalStorage.setItem('a', '1')).to.not.throw();
    expect(safeLocalStorage.getItem('a')).to.be.null;
    expect(safeLocalStorage.keys()).to.deep.eq([]);
    expect(() => safeLocalStorage.removeItem('a')).to.not.throw();
  });
});
