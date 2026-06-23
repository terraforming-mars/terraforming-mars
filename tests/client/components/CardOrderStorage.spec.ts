import {expect} from 'chai';
import {CardName} from '@/common/cards/CardName';
import {CardOrderStorage} from '@/client/utils/CardOrderStorage';
import {safeLocalStorage} from '@/client/utils/SafeLocalStorage';
import {FakeLocalStorage} from './FakeLocalStorage';

describe('CardOrderStorage', () => {
  let localStorage: FakeLocalStorage;

  beforeEach(() => {
    localStorage = new FakeLocalStorage();
    FakeLocalStorage.register(localStorage);
  });

  afterEach(() => {
    FakeLocalStorage.deregister(localStorage);
  });

  it('round-trips an order', () => {
    CardOrderStorage.updateCardOrder('p-foo', {[CardName.ANTS]: 1});
    expect(CardOrderStorage.getCardOrder('p-foo')).to.deep.eq({[CardName.ANTS]: 1});
  });

  it('returns an empty order when none is stored', () => {
    expect(CardOrderStorage.getCardOrder('p-none')).to.deep.eq({});
  });

  it('reads a legacy bare-JSON ordering (pre-envelope format) rather than discarding it', () => {
    // The format written before the storage layer existed: the bare order object.
    safeLocalStorage.setItem('cardOrderp-legacy', JSON.stringify({[CardName.ANTS]: 2, [CardName.BIRDS]: 1}));
    expect(CardOrderStorage.getCardOrder('p-legacy')).to.deep.eq({
      [CardName.ANTS]: 2,
      [CardName.BIRDS]: 1,
    });
  });
});
