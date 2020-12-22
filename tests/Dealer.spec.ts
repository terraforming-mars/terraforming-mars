import {expect} from 'chai';
import {Dealer} from '../src/Dealer';
import {COMMUNITY_CARD_MANIFEST} from '../src/cards/community/CommunityCardManifest';
import {CardFinder} from '../src/CardFinder';

describe('Dealer', function() {
  it('correctly separates 71 corporate era cards', function() {
    // include corporate era
    const dealer = Dealer.newInstance(true, false, false, false, false, false, false);
    expect(dealer.getDeckSize()).to.eq(208);

    // exclude corporate era
    const dealer2 = Dealer.newInstance(false, false, false, false, false, false, false);
    expect(dealer2.getDeckSize()).to.eq(137);
  });

  it.only('excludes expansion-specific preludes if those expansions are not selected ', function() {
    const dealer = Dealer.newInstance(true, false, false, false, false, false, false, true);
    const preludeDeck = dealer.preludeDeck;

    const turmoilPreludes = COMMUNITY_CARD_MANIFEST.preludeCards.cards.map((c) => c.cardName);
    turmoilPreludes.forEach((preludeName) => {
      const preludeCard = CardFinder.getProjectCardByName(preludeName)!;
      console.log("checking for " + preludeCard.name);
      expect(preludeDeck.includes(preludeCard.name)).is.not.true;
    });
  });

  it('serializes every property', function() {
    const dealer = Dealer.newInstance(false, false, false, false, false, false, false, false);
    const serialized = dealer.serialize();
    const serializedKeys = Object.keys(serialized);
    const dealerKeys = Object.keys(dealer);
    serializedKeys.sort();
    dealerKeys.sort();
    expect(serializedKeys).to.deep.eq(dealerKeys);
  });
});

