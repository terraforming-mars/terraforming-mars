import {expect} from 'chai';
import {COMMUNITY_CARD_MANIFEST} from '../src/cards/community/CommunityCardManifest';
import {CardFinder} from '../src/CardFinder';
import {TestingUtils} from './TestingUtils';
import {CardLoader} from '../src/CardLoader';
import {CardName} from '../src/common/cards/CardName';

describe('CardLoader', function() {
  it('correctly removes projectCardsToRemove', function() {
    // include corporate era
    const gameOptions = TestingUtils.setCustomGameOptions({
      corporateEra: false,
      preludeExtension: false,
      venusNextExtension: false,
      coloniesExtension: false,
      turmoilExtension: false,
      promoCardsOption: false,
      communityCardsOption: false,
      aresExtension: true,
    });
    const names = new CardLoader(gameOptions).getProjectCards().map((c) => c.name);
    expect(names).to.contain(CardName.SOLAR_FARM);
    expect(names).to.not.contain(CardName.CAPITAL);
  });

  it('correctly separates 71 corporate era cards', function() {
    // include corporate era
    const gameOptions = TestingUtils.setCustomGameOptions({
      corporateEra: true,
      preludeExtension: false,
      venusNextExtension: false,
      coloniesExtension: false,
      turmoilExtension: false,
      promoCardsOption: false,
      communityCardsOption: false,
      aresExtension: false,
    });
    expect(new CardLoader(gameOptions).getProjectCards().length)
      .to.eq(208);

    // exclude corporate era
    gameOptions.corporateEra = false;
    expect(new CardLoader(gameOptions).getProjectCards().length)
      .to.eq(137);
  });

  it('excludes expansion-specific preludes if those expansions are not selected ', function() {
    const gameOptions = TestingUtils.setCustomGameOptions({
      corporateEra: true,
      preludeExtension: false,
      venusNextExtension: false,
      coloniesExtension: false,
      turmoilExtension: false,
      promoCardsOption: false,
      communityCardsOption: true,
      aresExtension: false,
    });

    const preludeDeck = new CardLoader(gameOptions).getPreludeCards();

    const turmoilPreludes: Array<CardName> = [];
    COMMUNITY_CARD_MANIFEST.preludeCards.factories.forEach((cf) => turmoilPreludes.push(cf.cardName));
    turmoilPreludes.forEach((preludeName) => {
      const preludeCard = new CardFinder().getPreludeByName(preludeName)!;
      expect(preludeDeck.includes(preludeCard)).is.not.true;
    });
  });
});

