import {expect} from 'chai';
import {Dealer} from '../src/Dealer';
import {setCustomGameOptions} from './TestingUtils';
import {GameCards} from '../src/GameCards';

describe('Dealer', function() {
  it('deserializes from serialized', function() {
    const gameOptions = setCustomGameOptions({
      corporateEra: false,
      preludeExtension: true,
      venusNextExtension: false,
      coloniesExtension: true,
      turmoilExtension: false,
      promoCardsOption: true,
      communityCardsOption: false,
      aresExtension: true,
    });
    const dealer = Dealer.newInstance(new GameCards(gameOptions));
    expect(dealer).to.deep.eq(Dealer.deserialize(dealer.serialize()));
  });
});

