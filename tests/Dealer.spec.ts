import {expect} from 'chai';
import {Dealer} from '../src/Dealer';
import {COMMUNITY_CARD_MANIFEST} from '../src/cards/community/CommunityCardManifest';
import {CardFinder} from '../src/CardFinder';
import {setCustomGameOptions} from './TestingUtils';

describe('Dealer', function() {
  it('correctly separates 71 corporate era cards', function() {
    // include corporate era
    const dealer = Dealer.newInstance(setCustomGameOptions({
      corporateEra: true,
      preludeExtension: false,
      venusNextExtension: false,
      coloniesExtension: false,
      turmoilExtension: false,
      promoCardsOption: false,
      communityCardsOption: false,
      aresExtension: false,
    }));
    expect(dealer.getDeckSize()).to.eq(208);

    // exclude corporate era
    const dealer2 = Dealer.newInstance(setCustomGameOptions({
      corporateEra: false,
      preludeExtension: false,
      venusNextExtension: false,
      coloniesExtension: false,
      turmoilExtension: false,
      promoCardsOption: false,
      communityCardsOption: false,
      aresExtension: false,
    }));
    expect(dealer2.getDeckSize()).to.eq(137);
  });

  it('excludes expansion-specific preludes if those expansions are not selected ', function() {
    const dealer = Dealer.newInstance(setCustomGameOptions({
      corporateEra: true,
      preludeExtension: false,
      venusNextExtension: false,
      coloniesExtension: false,
      turmoilExtension: false,
      promoCardsOption: false,
      communityCardsOption: true,
      aresExtension: false,
    }));
    const preludeDeck = dealer.preludeDeck;

    const turmoilPreludes = COMMUNITY_CARD_MANIFEST.preludeCards.cards.map((c) => c.cardName);
    turmoilPreludes.forEach((preludeName) => {
      const preludeCard = new CardFinder().getProjectCardByName(preludeName)!;
      expect(preludeDeck.includes(preludeCard)).is.not.true;
    });
  });

  it('deserializes from serialized', function() {
    const options = setCustomGameOptions({
      corporateEra: false,
      preludeExtension: true,
      venusNextExtension: false,
      coloniesExtension: true,
      turmoilExtension: false,
      promoCardsOption: true,
      communityCardsOption: false,
      aresExtension: true,
    });
    const dealer = Dealer.newInstance(options);
    expect(dealer).to.deep.eq(Dealer.deserialize(dealer.serialize(), options));
  });
});

