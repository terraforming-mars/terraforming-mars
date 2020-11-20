import {expect} from 'chai';
import {Dealer} from '../src/Dealer';

describe('Dealer', function() {
  it('serializes every property', function() {
    const dealer = new Dealer(false, false, false, false, false, false, false, false);
    const serialized = dealer.serialize();
    const serializedKeys = Object.keys(serialized);
    const dealerKeys = Object.keys(dealer);
    serializedKeys.sort();
    dealerKeys.sort();
    expect(serializedKeys).to.deep.eq(dealerKeys);
  });
});

