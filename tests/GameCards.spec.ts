import {expect} from 'chai';
import {COMMUNITY_CARD_MANIFEST} from '../src/server/cards/community/CommunityCardManifest';
import {newPrelude} from '../src/server/CardFinder';
import {GameCards} from '../src/server/GameCards';
import {CardName} from '../src/common/cards/CardName';
import {CardManifest} from '../src/server/cards/ModuleManifest';
import {DEFAULT_GAME_OPTIONS, GameOptions} from '../src/server/game/GameOptions';

describe('GameCards', function() {
  it('correctly removes projectCardsToRemove', function() {
    // include corporate era
    const gameOptions: GameOptions = {
      ...DEFAULT_GAME_OPTIONS,
      aresExtension: true,
    };
    const names = new GameCards(gameOptions).getProjectCards().map((c) => c.name);
    expect(names).to.contain(CardName.SOLAR_FARM);
    expect(names).to.not.contain(CardName.CAPITAL);
  });

  it('correctly separates 71 corporate era cards', function() {
    // include corporate era
    const gameOptions: GameOptions = {
      ...DEFAULT_GAME_OPTIONS,
      corporateEra: true,
    };
    expect(new GameCards(gameOptions).getProjectCards().length)
      .to.eq(208);

    // exclude corporate era
    gameOptions.corporateEra = false;
    expect(new GameCards(gameOptions).getProjectCards().length)
      .to.eq(137);
  });

  it('excludes expansion-specific preludes if those expansions are not selected ', function() {
    const gameOptions: GameOptions = {
      ...DEFAULT_GAME_OPTIONS,
      corporateEra: true,
      communityCardsOption: true,
      aresExtension: false,
    };

    const preludeDeck = new GameCards(gameOptions).getPreludeCards();

    const communityPreludes = CardManifest.keys(COMMUNITY_CARD_MANIFEST.preludeCards);
    communityPreludes.forEach((preludeName) => {
      const preludeCard = newPrelude(preludeName)!;
      expect(preludeDeck.includes(preludeCard)).is.not.true;
    });
  });

  it('correctly removes the Merger prelude card if twoCorpsVariant is being used ', function() {
    const gameOptions: GameOptions = {
      ...DEFAULT_GAME_OPTIONS,
      corporateEra: true,
      preludeExtension: true,
      twoCorpsVariant: true,
    };

    const preludeDeck = new GameCards(gameOptions).getPreludeCards();
    expect(preludeDeck).to.not.contain(CardName.MERGER);
  });

  it('CEOs: Includes/Excludes specific CEOs if those expansions are/are not selected ', function() {
    const gameOptions: GameOptions = {
      ...DEFAULT_GAME_OPTIONS,
      ceoExtension: true,
      corporateEra: true,
      preludeExtension: true,
      moonExpansion: false,
    };
    const ceoNames = new GameCards(gameOptions).getCeoCards().map((c) => c.name);
    expect(ceoNames).to.contain(CardName.FLOYD); // Yes generic CEO
    expect(ceoNames).to.contain(CardName.KAREN); // Yes Prelude
    expect(ceoNames).not.to.contain(CardName.NEIL); // No Moon
  });
});

