import {expect} from 'chai';
import {safeLocalStorage} from '@/client/utils/SafeLocalStorage';
import {FakeLocalStorage, useFakeLocalStorage} from './FakeLocalStorage';

describe('SafeLocalStorage', () => {
  useFakeLocalStorage();

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

  class ThrowingLocalStorage extends FakeLocalStorage {
    public override getItem(): string | null {
      throw new Error('denied');
    }
    public override setItem() {
      throw new Error('denied');
    }
    public override removeItem() {
      throw new Error('denied');
    }
    public override get length(): number {
      throw new Error('denied');
    }
    public override key(): string | null {
      throw new Error('denied');
    }
  }

  it('fails soft when storage throws', () => {
    global.localStorage = new ThrowingLocalStorage();

    // None of these should throw.
    expect(() => safeLocalStorage.setItem('a', '1')).to.not.throw();
    expect(safeLocalStorage.getItem('a')).to.be.null;
    expect(safeLocalStorage.keys()).to.deep.eq([]);
    expect(() => safeLocalStorage.removeItem('a')).to.not.throw();
  });
});
