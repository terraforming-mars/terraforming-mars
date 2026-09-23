import {expect} from 'chai';
import {COMMUNITY_CARD_MANIFEST} from '../src/server/cards/community/CommunityCardManifest';
import {newPrelude} from '../src/server/createCard';
import {GameCards} from '../src/server/GameCards';
import {CardName} from '../src/common/cards/CardName';
import {CardManifest} from '../src/server/cards/ModuleManifest';
import {DEFAULT_GAME_OPTIONS, GameOptions} from '../src/server/game/GameOptions';
import {toName} from '../src/common/utils/utils';

describe('GameCards', () => {
  it('correctly removes projectCardsToRemove', () => {
    // include corporate era
    const gameOptions: GameOptions = {
      ...DEFAULT_GAME_OPTIONS,
      aresExtension: true,
    };
    const names = new GameCards(gameOptions).getProjectCards().map(toName);
    expect(names).to.contain(CardName.SOLAR_FARM);
    expect(names).to.not.contain(CardName.CAPITAL);
  });

  it('correctly separates 71 corporate era cards', () => {
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

  it('excludes expansion-specific preludes if those expansions are not selected ', () => {
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

  it('correctly removes the Merger prelude card if twoCorpsVariant is being used ', () => {
    const gameOptions: GameOptions = {
      ...DEFAULT_GAME_OPTIONS,
      corporateEra: true,
      preludeExtension: true,
      twoCorpsVariant: true,
    };

    const preludeDeck = new GameCards(gameOptions).getPreludeCards();
    expect(preludeDeck).to.not.contain(CardName.MERGER);
  });

  it('CEOs: Includes/Excludes specific CEOs if those expansions are/are not selected ', () => {
    const gameOptions: GameOptions = {
      ...DEFAULT_GAME_OPTIONS,
      ceoExtension: true,
      corporateEra: true,
      preludeExtension: true,
      moonExpansion: false,
    };
    const ceoNames = new GameCards(gameOptions).getCeoCards().map(toName);
    expect(ceoNames).to.contain(CardName.FLOYD); // Yes generic CEO
    expect(ceoNames).to.contain(CardName.KAREN); // Yes Prelude
    expect(ceoNames).not.to.contain(CardName.NEIL); // No Moon
  });

  it('correctly removes banned cards', () => {
    const gameOptions: GameOptions = {
      ...DEFAULT_GAME_OPTIONS,
      corporateEra: true,
      bannedCards: [CardName.SOLAR_WIND_POWER],
    };
    const names = new GameCards(gameOptions).getProjectCards().map(toName);
    expect(names).to.not.contain(CardName.SOLAR_WIND_POWER);
  });

  it('correctly includes the included cards', () => {
    const gameOptions: GameOptions = {
      ...DEFAULT_GAME_OPTIONS,
      corporateEra: true,
      includedCards: [CardName.VENUSIAN_INSECTS],
    };
    const names = new GameCards(gameOptions).getProjectCards().map(toName);
    expect(names).to.contain(CardName.VENUSIAN_INSECTS);
  });

  it('should not include the included cards in the standard projects', () => {
    const gameOptions: GameOptions = {
      ...DEFAULT_GAME_OPTIONS,
      corporateEra: true,
      includedCards: [CardName.VENUSIAN_INSECTS],
    };
    const names = new GameCards(gameOptions).getStandardProjects().map(toName);
    expect(names).to.not.contain(CardName.VENUSIAN_INSECTS);
  });

  it('should not include the included cards in the preludes', () => {
    const gameOptions: GameOptions = {
      ...DEFAULT_GAME_OPTIONS,
      corporateEra: true,
      includedCards: [CardName.VENUSIAN_INSECTS],
    };
    const names = new GameCards(gameOptions).getPreludeCards().map(toName);
    expect(names).to.not.contain(CardName.VENUSIAN_INSECTS);
  });

  it('should not include the included cards in the corporation cards', () => {
    const gameOptions: GameOptions = {
      ...DEFAULT_GAME_OPTIONS,
      corporateEra: true,
      includedCards: [CardName.VENUSIAN_INSECTS],
    };
    const names = new GameCards(gameOptions).getCorporationCards().map(toName);
    expect(names).to.not.contain(CardName.VENUSIAN_INSECTS);
  });

  it('should not include corporation cards in the included cards', () => {
    const gameOptions: GameOptions = {
      ...DEFAULT_GAME_OPTIONS,
      corporateEra: true,
      includedCards: [CardName.POINT_LUNA],
    };
    const names = new GameCards(gameOptions).getProjectCards().map(toName);
    expect(names).to.not.contain(CardName.POINT_LUNA);
  });

  it('should not include prelude cards in the included cards', () => {
    const gameOptions: GameOptions = {
      ...DEFAULT_GAME_OPTIONS,
      corporateEra: true,
      includedCards: [CardName.DONATION],
    };
    const names = new GameCards(gameOptions).getProjectCards().map(toName);
    expect(names).to.not.contain(CardName.DONATION);
  });

  it('should not include standard projects in the included cards', () => {
    const gameOptions: GameOptions = {
      ...DEFAULT_GAME_OPTIONS,
      corporateEra: true,
      includedCards: [CardName.GREENERY_STANDARD_PROJECT],
    };
    expect(() => new GameCards(gameOptions).getProjectCards()).to.throw('Card [Greenery] not found');
  });

  it('does not duplicate corporations when customCorporationsList mixes old and new card names', () => {
    // 'Thorgate' is the old name; CardName.THORGATE ('ThorGate') is canonical. Both are in base manifest.
    // 'EcoLine' is the old name; CardName.ECOLINE ('Ecoline') is canonical.
    const gameOptions: GameOptions = {
      ...DEFAULT_GAME_OPTIONS,
      customCorporationsList: ['Thorgate' as CardName, CardName.THORGATE, 'EcoLine' as CardName, CardName.ECOLINE],
    };
    const corps = new GameCards(gameOptions).getCorporationCards();
    const thorgates = corps.filter((c) => c.name === CardName.THORGATE);
    const ecolines = corps.filter((c) => c.name === CardName.ECOLINE);
    expect(thorgates).to.have.length(1);
    expect(ecolines).to.have.length(1);
  });

  it('customCorporationsList restricts the corporation deck to only those corps', () => {
    const gameOptions: GameOptions = {
      ...DEFAULT_GAME_OPTIONS,
      corporateEra: true,
      customCorporationsList: [CardName.INVENTRIX, CardName.HELION, CardName.THARSIS_REPUBLIC],
    };
    const names = new GameCards(gameOptions).getCorporationCards().map(toName);
    expect(names).to.have.members([CardName.INVENTRIX, CardName.HELION, CardName.THARSIS_REPUBLIC]);
    expect(names).to.have.length(3);
  });

  it('customCorporationsList accepts an old card name on its own', () => {
    const gameOptions: GameOptions = {
      ...DEFAULT_GAME_OPTIONS,
      corporateEra: true,
      customCorporationsList: ['Thorgate' as CardName, CardName.HELION],
    };
    const names = new GameCards(gameOptions).getCorporationCards().map(toName);
    expect(names).to.have.members([CardName.THORGATE, CardName.HELION]);
    expect(names).to.have.length(2);
  });

  it('customCorporationsList includes corps from disabled expansions', () => {
    const gameOptions: GameOptions = {
      ...DEFAULT_GAME_OPTIONS,
      corporateEra: true,
      moonExpansion: false,
      customCorporationsList: [CardName.INVENTRIX, CardName.LUNA_TRADE_FEDERATION],
    };
    const names = new GameCards(gameOptions).getCorporationCards().map(toName);
    expect(names).to.have.members([CardName.INVENTRIX, CardName.LUNA_TRADE_FEDERATION]);
    expect(names).to.have.length(2);
  });

  it('customPreludes restricts the prelude deck to only those preludes', () => {
    const gameOptions: GameOptions = {
      ...DEFAULT_GAME_OPTIONS,
      preludeExtension: true,
      customPreludes: [CardName.ALLIED_BANK, CardName.AQUIFER_TURBINES],
    };
    const names = new GameCards(gameOptions).getPreludeCards().map(toName);
    expect(names).to.have.members([CardName.ALLIED_BANK, CardName.AQUIFER_TURBINES]);
    expect(names).to.have.length(2);
  });

  it('customCeos restricts the CEO deck to only those CEOs', () => {
    const gameOptions: GameOptions = {
      ...DEFAULT_GAME_OPTIONS,
      ceoExtension: true,
      customCeos: [CardName.FLOYD, CardName.HAL9000],
    };
    const names = new GameCards(gameOptions).getCeoCards().map(toName);
    expect(names).to.have.members([CardName.FLOYD, CardName.HAL9000]);
    expect(names).to.have.length(2);
  });
});

