import {expect} from 'chai';
import {validationDetails, Helpers, validateNewGameConfig, ValidationErrors} from '../../../src/common/game/validateNewGameConfig';
import {NewGameConfig, NewPlayerModel} from '../../../src/common/game/NewGameConfig';
import {RandomBoardOption} from '../../../src/common/boards/RandomBoardOption';
import {RandomMAOptionType} from '../../../src/common/ma/RandomMAOptionType';
import {CardName} from '../../../src/common/cards/CardName';
import {ColonyName} from '../../../src/common/colonies/ColonyName';
import {Expansion} from '../../../src/common/cards/GameModule';
import {LogMessageDataType} from '../../../src/common/logs/LogMessageDataType';
import {CEO_CARDS_DEALT_PER_PLAYER} from '../../../src/common/constants';

function player(first: boolean = false): NewPlayerModel {
  return {name: 'Robot', color: 'blue', beginner: false, handicap: 0, first};
}

function players(count: number): Array<NewPlayerModel> {
  return Array.from({length: count}, (_, idx) => player(idx === 0));
}

function newGameConfig(overrides: Partial<NewGameConfig> = {}): NewGameConfig {
  return {
    players: players(2),
    expansions: {
      corpera: true,
      promo: false,
      venus: false,
      colonies: false,
      prelude: false,
      prelude2: false,
      turmoil: false,
      community: false,
      ares: false,
      moon: false,
      pathfinders: false,
      ceo: false,
      starwars: false,
      underworld: false,
      deltaProject: false,
    },
    board: RandomBoardOption.OFFICIAL,
    seed: 0,
    randomFirstPlayer: false,
    clonedGamedId: undefined,
    undoOption: false,
    showTimers: false,
    fastModeOption: false,
    showOtherPlayersVP: false,
    aresExtremeVariant: false,
    politicalAgendasExtension: 'Standard',
    solarPhaseOption: false,
    removeNegativeGlobalEventsOption: false,
    modularMA: false,
    draftVariant: false,
    initialDraft: false,
    preludeDraftVariant: false,
    ceosDraftVariant: false,
    startingCorporations: 2,
    shuffleMapOption: false,
    randomMA: RandomMAOptionType.NONE,
    includeFanMA: false,
    soloTR: false,
    customCorporationsList: [],
    bannedCards: [],
    includedCards: [],
    customColoniesList: [],
    customPreludes: [],
    requiresMoonTrackCompletion: false,
    requiresVenusTrackCompletion: false,
    moonStandardProjectVariant: false,
    moonStandardProjectVariant1: false,
    altVenusBoard: false,
    escapeVelocity: undefined,
    twoCorpsVariant: false,
    customCeos: [],
    startingCeos: 3,
    startingPreludes: 4,
    ...overrides,
  };
}

const NO_ERRORS: ValidationErrors = {
  negativeEscapeVelocity: false,
  notEnoughColonies: 0,
  notEnoughCeos: 0,
  notEnoughPreludes: 0,
  maybeNotEnoughPreludes: [],
  coloniesMissingExpansions: [],
  corporationsMissingExpansions: [],
  preludesMissingExpansions: [],
  ceosMissingExpansions: [],
  soloWithoutCorporateEra: false,
  infiniteEnergyBug: false,
  notEnoughCorporations: 0,
};

function helpers(
  cards: Partial<Record<CardName, Array<Expansion>>> = {},
  colonies: Partial<Record<ColonyName, Expansion>> = {}): Helpers {
  return {
    getCardCompatibility: (name) => cards[name] ?? [],
    getColonyExpansion: (name) => colonies[name],
  };
}

function validate(overrides: Partial<NewGameConfig> = {}, h: Helpers = helpers()) {
  return validateNewGameConfig(newGameConfig(overrides), h);
}

const SIX_CARDS = [
  CardName.ALGAE,
  CardName.ADAPTATION_TECHNOLOGY,
  CardName.ADAPTED_LICHEN,
  CardName.AEROBRAKED_AMMONIA_ASTEROID,
  CardName.AI_CENTRAL,
  CardName.ANTS,
];

describe('validateNewGameConfig', () => {
  it('default config has no errors', () => {
    expect(validate()).deep.eq(NO_ERRORS);
  });

  it('negative escape velocity', () => {
    expect(validate({
      escapeVelocity: {thresholdMinutes: -1, bonusSectionsPerAction: 0, penaltyPeriodMinutes: 2, penaltyVPPerPeriod: 1},
    }).negativeEscapeVelocity).is.true;
    expect(validate({
      escapeVelocity: {thresholdMinutes: 30, bonusSectionsPerAction: 0, penaltyPeriodMinutes: 2, penaltyVPPerPeriod: 1},
    }).negativeEscapeVelocity).is.false;
  });

  it('not enough colonies', () => {
    const threeColonies = [ColonyName.LUNA, ColonyName.TITAN, ColonyName.PLUTO];
    expect(validate({players: players(1), customColoniesList: threeColonies}).notEnoughColonies).eq(4);
    expect(validate({players: players(2), customColoniesList: threeColonies}).notEnoughColonies).eq(5);
    expect(validate({players: players(3), customColoniesList: threeColonies}).notEnoughColonies).eq(5);
    expect(validate({players: players(4), customColoniesList: threeColonies}).notEnoughColonies).eq(6);

    const fiveColonies = [...threeColonies, ColonyName.CERES, ColonyName.MIRANDA];
    expect(validate({players: players(2), customColoniesList: fiveColonies}).notEnoughColonies).eq(0);
  });

  it('colonies missing expansions', () => {
    const colonies = [ColonyName.LUNA, ColonyName.TITAN, ColonyName.PLUTO, ColonyName.CERES, ColonyName.IAPETUS];
    const h = helpers({}, {[ColonyName.IAPETUS]: 'pathfinders'});

    expect(validate({customColoniesList: colonies}, h).coloniesMissingExpansions).deep.eq([ColonyName.IAPETUS]);

    const expansions = {...newGameConfig().expansions, pathfinders: true};
    expect(validate({customColoniesList: colonies, expansions}, h).coloniesMissingExpansions).deep.eq([]);
  });

  it('solo without corporate era', () => {
    const expansions = {...newGameConfig().expansions, corpera: false};
    expect(validate({players: players(1), expansions}).soloWithoutCorporateEra).is.true;
    expect(validate({players: players(2), expansions}).soloWithoutCorporateEra).is.false;
    expect(validate({players: players(1)}).soloWithoutCorporateEra).is.false;
  });

  it('infinite energy bug', () => {
    const expansions = {...newGameConfig().expansions, prelude2: true, pathfinders: true};
    expect(validate({expansions}).infiniteEnergyBug).is.true;
    expect(validate({includedCards: [CardName.SUITABLE_INFRASTRUCTURE, CardName.HIGH_TEMP_SUPERCONDUCTORS]}).infiniteEnergyBug).is.true;

    expect(validate({expansions, customCorporationsList: [CardName.ECOLINE]}).infiniteEnergyBug).is.false;
    expect(validate({expansions, customCorporationsList: [CardName.THORGATE]}).infiniteEnergyBug).is.true;
    expect(validate({expansions, bannedCards: [CardName.STANDARD_TECHNOLOGY]}).infiniteEnergyBug).is.false;
    expect(validate({expansions, bannedCards: [CardName.SUITABLE_INFRASTRUCTURE]}).infiniteEnergyBug).is.false;
    expect(validate({expansions, bannedCards: [CardName.HIGH_TEMP_SUPERCONDUCTORS]}).infiniteEnergyBug).is.false;
    expect(validate({expansions: {...expansions, prelude2: false}}).infiniteEnergyBug).is.false;
    expect(validate({expansions: {...expansions, pathfinders: false}}).infiniteEnergyBug).is.false;
  });

  it('not enough corporations', () => {
    const corps = [CardName.ECOLINE, CardName.HELION, CardName.THORGATE];
    expect(validate({customCorporationsList: corps}).notEnoughCorporations).eq(4);
    expect(validate({customCorporationsList: [...corps, CardName.CREDICOR]}).notEnoughCorporations).eq(0);
  });

  it('cards missing expansions', () => {
    const h = helpers({
      [CardName.ECOLINE]: ['venus', 'colonies'],
      [CardName.ALGAE]: ['turmoil'],
      [CardName.KAREN]: ['moon'],
    });

    const errors = validate({
      customCorporationsList: [CardName.ECOLINE, CardName.HELION, CardName.THORGATE, CardName.CREDICOR],
      customPreludes: SIX_CARDS,
      customCeos: [CardName.KAREN],
    }, h);

    // Ecoline is listed once, even though it's missing two expansions.
    expect(errors.corporationsMissingExpansions).deep.eq([CardName.ECOLINE]);
    expect(errors.preludesMissingExpansions).deep.eq([CardName.ALGAE]);
    expect(errors.ceosMissingExpansions).deep.eq([CardName.KAREN]);

    const expansions = {...newGameConfig().expansions, venus: true, colonies: true};
    expect(validate({customCorporationsList: [CardName.ECOLINE], expansions}, h).corporationsMissingExpansions).deep.eq([]);
  });

  it('not enough preludes', () => {
    expect(validate({customPreludes: SIX_CARDS}).notEnoughPreludes).eq(8);
    expect(validate({customPreludes: SIX_CARDS, startingPreludes: 3}).notEnoughPreludes).eq(0);
  });

  it('maybe not enough preludes', () => {
    expect(validate().maybeNotEnoughPreludes).deep.eq([]);

    // Valley Trust can be dealt when there's no custom corporation list.
    expect(validate({customPreludes: SIX_CARDS}).maybeNotEnoughPreludes).deep.eq([CardName.VALLEY_TRUST]);

    expect(validate({
      customPreludes: [...SIX_CARDS, CardName.NEW_PARTNER, CardName.BOARD_OF_DIRECTORS],
      customCorporationsList: [CardName.ECOLINE],
    }).maybeNotEnoughPreludes).deep.eq([CardName.NEW_PARTNER, CardName.BOARD_OF_DIRECTORS]);

    const expansions = {...newGameConfig().expansions, turmoil: true, prelude2: true, ceo: true};
    expect(validate({
      customPreludes: SIX_CARDS,
      customCorporationsList: [CardName.ECOLINE],
      expansions,
    }).maybeNotEnoughPreludes).deep.eq([CardName.WG_PROJECT, CardName.KAREN]);

    expect(validate({
      customPreludes: SIX_CARDS,
      customCorporationsList: [CardName.ECOLINE],
      customCeos: [CardName.FLOYD],
      bannedCards: [CardName.WG_PROJECT],
      expansions,
    }).maybeNotEnoughPreludes).deep.eq([]);

    const base = {customPreludes: SIX_CARDS, customCorporationsList: [CardName.ECOLINE]};
    const noExpansions = newGameConfig().expansions;
    // WG Project requires Turmoil.
    expect(validate({...base, expansions: {...noExpansions, prelude2: true}}).maybeNotEnoughPreludes).deep.eq([]);
    expect(validate({...base, expansions: {...noExpansions, turmoil: true}, includedCards: [CardName.WG_PROJECT]}).maybeNotEnoughPreludes).deep.eq([CardName.WG_PROJECT]);
    expect(validate({...base, expansions: {...noExpansions, ceo: true}, customCeos: [CardName.KAREN]}).maybeNotEnoughPreludes).deep.eq([CardName.KAREN]);
    expect(validate({...base, customCeos: [CardName.KAREN]}).maybeNotEnoughPreludes).deep.eq([]);
  });

  it('not enough CEOs', () => {
    expect(validate({customCeos: [CardName.KAREN]}).notEnoughCeos).eq(2 * Math.max(3, CEO_CARDS_DEALT_PER_PLAYER));
    expect(validate({customCeos: [CardName.KAREN], startingCeos: 0}).notEnoughCeos).eq(2 * CEO_CARDS_DEALT_PER_PLAYER);
    expect(validate({customCeos: [CardName.KAREN], startingCeos: 1}).notEnoughCeos).eq(2 * CEO_CARDS_DEALT_PER_PLAYER);
    expect(validate({customCeos: [CardName.KAREN], startingCeos: 4}).notEnoughCeos).eq(2 * 4);
  });

  it('messages', () => {
    const notEnoughColonies = validationDetails.notEnoughColonies.message;
    expect(typeof notEnoughColonies === 'function' && notEnoughColonies({...NO_ERRORS, notEnoughColonies: 5})).deep.eq({
      message: 'Must select at least ${0} colonies',
      data: [{type: LogMessageDataType.RAW_STRING, value: '5'}],
    });
  });
});
