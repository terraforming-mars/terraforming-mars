import {expect} from 'chai';
import {CardName} from '@/common/cards/CardName';
import {CardOrderStorage} from '@/client/utils/CardOrderStorage';
import {useFakeLocalStorage} from './FakeLocalStorage';

describe('CardOrderStorage', () => {
  useFakeLocalStorage();

  it('round-trips an order', () => {
    CardOrderStorage.updateCardOrder('p-foo', {[CardName.ANTS]: 1});
    expect(CardOrderStorage.getCardOrder('p-foo')).to.deep.eq({[CardName.ANTS]: 1});
  });

  it('returns an empty order when none is stored', () => {
    expect(CardOrderStorage.getCardOrder('p-none')).to.deep.eq({});
  });
});
