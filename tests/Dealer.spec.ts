import {expect} from 'chai';
import {Dealer} from '../src/Dealer';
import {TestingUtils} from './TestingUtils';
import {CardLoader} from '../src/CardLoader';

describe('Dealer', function() {
  it('deserializes from serialized', function() {
    const gameOptions = TestingUtils.setCustomGameOptions({
      corporateEra: false,
      preludeExtension: true,
      venusNextExtension: false,
      coloniesExtension: true,
      turmoilExtension: false,
      promoCardsOption: true,
      communityCardsOption: false,
      aresExtension: true,
    });
    const dealer = Dealer.newInstance(new CardLoader(gameOptions));
    expect(dealer).to.deep.eq(Dealer.deserialize(dealer.serialize()));
  });
});

