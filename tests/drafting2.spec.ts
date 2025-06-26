// Tests for drafts that get reserialized partway through the game.

import {expect} from 'chai';
import {CardName} from '../src/common/cards/CardName';
import {Phase} from '../src/common/Phase';
import {Database} from '../src/server/database/Database';
import {Game} from '../src/server/Game';
import {SelectCard} from '../src/server/inputs/SelectCard';
import {SerializedGame} from '../src/server/SerializedGame';
import {testGame} from './TestGame';
import {InMemoryDatabase} from './testing/InMemoryDatabase';
import {cast, finishGeneration} from './TestingUtils';
import {toName} from '../src/common/utils/utils';
import {restoreTestDatabase, setTestDatabase} from './testing/setup';

// Tests for deserializing a game at the start of the drafting phase.
describe('drafting and serialization', () => {
  let db: InMemoryDatabase;

  beforeEach(() => {
    db = new InMemoryDatabase();
    setTestDatabase(db);
  });

  afterEach(async () => {
    restoreTestDatabase();
  });

  it('2 player - project draft', () => {
    const game = Game.deserialize(stored as unknown as SerializedGame);
    const [p1, p2] = game.getPlayers();
    const p1w = cast(p1.getWaitingFor(), SelectCard);
    const p2w = cast(p2.getWaitingFor(), SelectCard);
    expect(game.phase).eq(Phase.DRAFTING);
    expect(game.draftRound).eq(1);
    expect(p1w.cards).has.length(4);
    expect(p2w.cards).has.length(4);
    expect(p1w.cards.map(toName)).to.have.members([CardName.FISH, CardName.MINE, CardName.OPTIMAL_AEROBRAKING, CardName.SABOTAGE]);
    expect(p2w.cards.map(toName)).to.have.members([CardName.COMMERCIAL_DISTRICT, CardName.BIOMASS_COMBUSTORS, CardName.DOMED_CRATER, CardName.BUSINESS_CONTACTS]);
  });

  it('2 player - project draft - server after partial draft', async () => {
    const [game, player1, player2] = testGame(2, {draftVariant: true});

    game.generation = 1;
    // This moves into draft phase
    finishGeneration(game);

    const selectCard = cast(player1.popWaitingFor(), SelectCard);
    selectCard.process({type: 'card', cards: [selectCard.cards[0].name]});
    const selectCard2 = cast(player2.popWaitingFor(), SelectCard);
    selectCard2.process({type: 'card', cards: [selectCard2.cards[0].name]});

    expect(game.draftRound).eq(2);

    const serializedGame = await Database.getInstance().getGameVersion(game.id, game.lastSaveId - 1);
    const game2 = Game.deserialize(serializedGame);

    expect(game2.phase).eq(Phase.DRAFTING);
    expect(game2.draftRound).eq(2);
  });

  it('2 player - project draft - server reset during first draft round', async () => {
    const [game] = testGame(2, {draftVariant: true});

    game.generation = 1;
    // This moves into draft phase
    finishGeneration(game);

    expect(game.draftRound).eq(1);

    const serializedGame = await Database.getInstance().getGameVersion(game.id, game.lastSaveId - 1);
    const game2 = Game.deserialize(serializedGame);

    expect(game2.phase).eq(Phase.DRAFTING);
    expect(game2.draftRound).eq(1);
    const players2 = game2.getPlayers();

    const selectCard = cast(players2[0].getWaitingFor(), SelectCard);
    selectCard.process({type: 'card', cards: [selectCard.cards[0].name]});
    const selectCard2 = cast(players2[1].getWaitingFor(), SelectCard);
    selectCard2.process({type: 'card', cards: [selectCard2.cards[0].name]});
  });
});

const stored = {
  'activePlayer': 'p3c86909cda90',
  'awards': [
    'Landlord',
    'Scientist',
    'Banker',
    'Thermalist',
    'Miner',
  ],
  'beholdTheEmperor': false,
  'board': {
    'spaces': [
      {
        'id': '01',
        'spaceType': 'colony',
        'bonus': [],
        'x': -1,
        'y': -1,
      },
      {
        'id': '02',
        'spaceType': 'colony',
        'bonus': [],
        'x': -1,
        'y': -1,
      },
      {
        'id': '03',
        'spaceType': 'land',
        'bonus': [
          1,
          1,
        ],
        'x': 4,
        'y': 0,
      },
      {
        'id': '04',
        'spaceType': 'ocean',
        'bonus': [
          1,
          1,
        ],
        'x': 5,
        'y': 0,
      },
      {
        'id': '05',
        'spaceType': 'land',
        'bonus': [],
        'x': 6,
        'y': 0,
      },
      {
        'id': '06',
        'spaceType': 'ocean',
        'bonus': [
          3,
        ],
        'x': 7,
        'y': 0,
      },
      {
        'id': '07',
        'spaceType': 'ocean',
        'bonus': [],
        'x': 8,
        'y': 0,
      },
      {
        'id': '08',
        'spaceType': 'land',
        'bonus': [],
        'x': 3,
        'y': 1,
      },
      {
        'id': '09',
        'spaceType': 'land',
        'bonus': [
          1,
        ],
        'x': 4,
        'y': 1,
      },
      {
        'id': '10',
        'spaceType': 'land',
        'bonus': [],
        'x': 5,
        'y': 1,
      },
      {
        'id': '11',
        'spaceType': 'land',
        'bonus': [],
        'x': 6,
        'y': 1,
      },
      {
        'id': '12',
        'spaceType': 'land',
        'bonus': [],
        'x': 7,
        'y': 1,
      },
      {
        'id': '13',
        'spaceType': 'ocean',
        'bonus': [
          3,
          3,
        ],
        'x': 8,
        'y': 1,
      },
      {
        'id': '14',
        'spaceType': 'land',
        'bonus': [
          3,
        ],
        'x': 2,
        'y': 2,
      },
      {
        'id': '15',
        'spaceType': 'land',
        'bonus': [],
        'x': 3,
        'y': 2,
      },
      {
        'id': '16',
        'spaceType': 'land',
        'bonus': [],
        'x': 4,
        'y': 2,
      },
      {
        'id': '17',
        'spaceType': 'land',
        'bonus': [],
        'x': 5,
        'y': 2,
      },
      {
        'id': '18',
        'spaceType': 'land',
        'bonus': [],
        'x': 6,
        'y': 2,
      },
      {
        'id': '19',
        'spaceType': 'land',
        'bonus': [],
        'x': 7,
        'y': 2,
      },
      {
        'id': '20',
        'spaceType': 'land',
        'bonus': [
          1,
        ],
        'x': 8,
        'y': 2,
      },
      {
        'id': '21',
        'spaceType': 'land',
        'bonus': [
          2,
          0,
        ],
        'x': 1,
        'y': 3,
      },
      {
        'id': '22',
        'spaceType': 'land',
        'bonus': [
          2,
        ],
        'x': 2,
        'y': 3,
      },
      {
        'id': '23',
        'spaceType': 'land',
        'bonus': [
          2,
        ],
        'x': 3,
        'y': 3,
      },
      {
        'id': '24',
        'spaceType': 'land',
        'bonus': [
          2,
        ],
        'x': 4,
        'y': 3,
      },
      {
        'id': '25',
        'spaceType': 'land',
        'bonus': [
          2,
          2,
        ],
        'x': 5,
        'y': 3,
      },
      {
        'id': '26',
        'spaceType': 'land',
        'bonus': [
          2,
        ],
        'x': 6,
        'y': 3,
      },
      {
        'id': '27',
        'spaceType': 'land',
        'bonus': [
          2,
        ],
        'x': 7,
        'y': 3,
      },
      {
        'id': '28',
        'spaceType': 'ocean',
        'bonus': [
          2,
          2,
        ],
        'x': 8,
        'y': 3,
      },
      {
        'id': '29',
        'spaceType': 'land',
        'bonus': [
          2,
          2,
        ],
        'x': 0,
        'y': 4,
      },
      {
        'id': '30',
        'spaceType': 'land',
        'bonus': [
          2,
          2,
        ],
        'x': 1,
        'y': 4,
      },
      {
        'id': '31',
        'spaceType': 'land',
        'bonus': [
          2,
          2,
        ],
        'x': 2,
        'y': 4,
      },
      {
        'id': '32',
        'spaceType': 'ocean',
        'bonus': [
          2,
          2,
        ],
        'x': 3,
        'y': 4,
      },
      {
        'id': '33',
        'spaceType': 'ocean',
        'bonus': [
          2,
          2,
        ],
        'x': 4,
        'y': 4,
      },
      {
        'id': '34',
        'spaceType': 'ocean',
        'bonus': [
          2,
          2,
        ],
        'x': 5,
        'y': 4,
      },
      {
        'id': '35',
        'spaceType': 'land',
        'bonus': [
          2,
          2,
        ],
        'x': 6,
        'y': 4,
      },
      {
        'id': '36',
        'spaceType': 'land',
        'bonus': [
          2,
          2,
        ],
        'x': 7,
        'y': 4,
      },
      {
        'id': '37',
        'spaceType': 'land',
        'bonus': [
          2,
          2,
        ],
        'x': 8,
        'y': 4,
      },
      {
        'id': '38',
        'spaceType': 'land',
        'bonus': [
          2,
        ],
        'x': 1,
        'y': 5,
      },
      {
        'id': '39',
        'spaceType': 'land',
        'bonus': [
          2,
          2,
        ],
        'x': 2,
        'y': 5,
      },
      {
        'id': '40',
        'spaceType': 'land',
        'bonus': [
          2,
        ],
        'x': 3,
        'y': 5,
      },
      {
        'id': '41',
        'spaceType': 'land',
        'bonus': [
          2,
        ],
        'x': 4,
        'y': 5,
      },
      {
        'id': '42',
        'spaceType': 'land',
        'bonus': [
          2,
        ],
        'x': 5,
        'y': 5,
      },
      {
        'id': '43',
        'spaceType': 'ocean',
        'bonus': [
          2,
        ],
        'x': 6,
        'y': 5,
      },
      {
        'id': '44',
        'spaceType': 'ocean',
        'bonus': [
          2,
        ],
        'x': 7,
        'y': 5,
      },
      {
        'id': '45',
        'spaceType': 'ocean',
        'bonus': [
          2,
        ],
        'x': 8,
        'y': 5,
      },
      {
        'id': '46',
        'spaceType': 'land',
        'bonus': [],
        'x': 2,
        'y': 6,
      },
      {
        'id': '47',
        'spaceType': 'land',
        'bonus': [],
        'x': 3,
        'y': 6,
      },
      {
        'id': '48',
        'spaceType': 'land',
        'bonus': [],
        'x': 4,
        'y': 6,
      },
      {
        'id': '49',
        'spaceType': 'land',
        'bonus': [],
        'x': 5,
        'y': 6,
      },
      {
        'id': '50',
        'spaceType': 'land',
        'bonus': [],
        'x': 6,
        'y': 6,
      },
      {
        'id': '51',
        'spaceType': 'land',
        'bonus': [
          2,
        ],
        'x': 7,
        'y': 6,
      },
      {
        'id': '52',
        'spaceType': 'land',
        'bonus': [],
        'x': 8,
        'y': 6,
      },
      {
        'id': '53',
        'spaceType': 'land',
        'bonus': [
          1,
          1,
        ],
        'x': 3,
        'y': 7,
      },
      {
        'id': '54',
        'spaceType': 'land',
        'bonus': [],
        'x': 4,
        'y': 7,
      },
      {
        'id': '55',
        'spaceType': 'land',
        'bonus': [
          3,
        ],
        'x': 5,
        'y': 7,
      },
      {
        'id': '56',
        'spaceType': 'land',
        'bonus': [
          3,
        ],
        'x': 6,
        'y': 7,
      },
      {
        'id': '57',
        'spaceType': 'land',
        'bonus': [],
        'x': 7,
        'y': 7,
      },
      {
        'id': '58',
        'spaceType': 'land',
        'bonus': [
          0,
        ],
        'x': 8,
        'y': 7,
      },
      {
        'id': '59',
        'spaceType': 'land',
        'bonus': [
          1,
        ],
        'x': 4,
        'y': 8,
      },
      {
        'id': '60',
        'spaceType': 'land',
        'bonus': [
          1,
          1,
        ],
        'x': 5,
        'y': 8,
      },
      {
        'id': '61',
        'spaceType': 'land',
        'bonus': [],
        'x': 6,
        'y': 8,
      },
      {
        'id': '62',
        'spaceType': 'land',
        'bonus': [],
        'x': 7,
        'y': 8,
      },
      {
        'id': '63',
        'spaceType': 'ocean',
        'bonus': [
          0,
          0,
        ],
        'x': 8,
        'y': 8,
      },
      {
        'id': '69',
        'spaceType': 'colony',
        'bonus': [],
        'x': -1,
        'y': -1,
      },
    ],
  },
  'claimedMilestones': [],
  'ceoDeck': {
    'drawPile': [],
    'discardPile': [],
  },
  'colonies': [],
  'corporationDeck': {
    'drawPile': [
      'Tharsis Republic',
      'Inventrix',
      'CrediCor',
      'United Nations Mars Initiative',
      'Mining Guild',
      'EcoLine',
      'Saturn Systems',
      'Teractor',
    ],
    'discardPile': [
      'Interplanetary Cinematics',
      'PhoboLog',
    ],
  },
  'createdTimeMs': 1717193712145,
  'currentSeed': 471075109419,
  'deferredActions': [],
  'donePlayers': [],
  'draftedPlayers': [],
  'draftRound': 1,
  'first': 'p3c86909cda90',
  'fundedAwards': [],
  'gagarinBase': [],
  'stJosephCathedrals': [],
  'gameAge': 12,
  'gameLog': [],
  'gameOptions': {
    'altVenusBoard': false,
    'aresExtension': false,
    'aresHazards': true,
    'boardName': 'tharsis',
    'bannedCards': [],
    'includedCards': [],
    'ceoExtension': false,
    'coloniesExtension': false,
    'communityCardsOption': false,
    'corporateEra': true,
    'customCeos': [],
    'customColoniesList': [],
    'customCorporationsList': [],
    'customPreludes': [],
    'draftVariant': true,
    'escapeVelocityMode': false,
    'escapeVelocityBonusSeconds': 2,
    'fastModeOption': false,
    'includeFanMA': false,
    'initialDraftVariant': false,
    'moonExpansion': false,
    'moonStandardProjectVariant': false,
    'pathfindersExpansion': false,
    'politicalAgendasExtension': 'Standard',
    'preludeDraftVariant': false,
    'preludeExtension': false,
    'prelude2Expansion': false,
    'promoCardsOption': false,
    'randomMA': 'No randomization',
    'requiresMoonTrackCompletion': false,
    'removeNegativeGlobalEventsOption': false,
    'requiresVenusTrackCompletion': false,
    'showOtherPlayersVP': false,
    'showTimers': true,
    'shuffleMapOption': false,
    'solarPhaseOption': false,
    'soloTR': false,
    'startingCeos': 3,
    'startingCorporations': 2,
    'startingPreludes': 4,
    'starWarsExpansion': false,
    'turmoilExtension': false,
    'underworldExpansion': false,
    'undoOption': false,
    'venusNextExtension': false,
    'twoCorpsVariant': false,
  },
  'generation': 2,
  'globalsPerGeneration': [
    {
      'temperature': -30,
      'oxygen': 0,
      'oceans': 0,
    },
  ],
  'id': 'gff5c1affc4be',
  'initialDraftIteration': 1,
  'lastSaveId': 3,
  'milestones': [
    'Terraformer',
    'Mayor',
    'Gardener',
    'Builder',
    'Planner',
  ],
  'oxygenLevel': 0,
  'passedPlayers': [],
  'phase': 'drafting',
  'players': [
    {
      'id': 'p7ff7d31b6f04',
      'corporations': [
        {
          'name': 'Helion',
          'resourceCount': 0,
          'isDisabled': false,
        },
      ],
      'pickedCorporationCard': 'Helion',
      'terraformRating': 20,
      'hasIncreasedTerraformRatingThisGeneration': false,
      'megaCredits': 59,
      'megaCreditProduction': 0,
      'steel': 0,
      'steelProduction': 0,
      'titanium': 0,
      'titaniumProduction': 0,
      'plants': 0,
      'plantProduction': 0,
      'energy': 0,
      'energyProduction': 0,
      'heat': 3,
      'heatProduction': 3,
      'titaniumValue': 3,
      'steelValue': 2,
      'canUseHeatAsMegaCredits': true,
      'canUsePlantsAsMegaCredits': false,
      'canUseTitaniumAsMegacredits': false,
      'canUseCorruptionAsMegacredits': false,
      'actionsTakenThisRound': 0,
      'actionsThisGeneration': [],
      'pendingInitialActions': [],
      'dealtCorporationCards': [
        'Helion',
        'Interplanetary Cinematics',
      ],
      'dealtPreludeCards': [],
      'dealtCeoCards': [],
      'dealtProjectCards': [
        'Lake Marineris',
        'Ironworks',
        'Herbivores',
        'Olympus Conference',
        'Mangrove',
        'Tropical Resort',
        'Urbanized Area',
        'Noctis Farming',
        'Development Center',
        'Space Elevator',
      ],
      'draftHand': [],
      'cardsInHand': [
        'Lake Marineris',
      ],
      'preludeCardsInHand': [],
      'ceoCardsInHand': [],
      'playedCards': [],
      'draftedCards': [],
      'cardCost': 3,
      'cardDiscount': 0,
      'fleetSize': 1,
      'tradesThisGeneration': 0,
      'colonyTradeOffset': 0,
      'colonyTradeDiscount': 0,
      'colonyVictoryPoints': 0,
      'turmoilPolicyActionUsed': false,
      'politicalAgendasActionUsedCount': 0,
      'hasTurmoilScienceTagBonus': false,
      'oceanBonus': 2,
      'scienceTagCount': 0,
      'plantsNeededForGreenery': 8,
      'removingPlayers': [],
      'removedFromPlayCards': [],
      'name': 'Red',
      'color': 'red',
      'beginner': false,
      'handicap': 0,
      'timer': {
        'sumElapsed': 5302,
        'startedAt': 1717193723504,
        'running': false,
        'afterFirstAction': true,
        'lastStoppedAt': 1717194258672,
      },
      'actionsTakenThisGame': 1,
      'victoryPointsByGeneration': [
        20,
      ],
      'totalDelegatesPlaced': 0,
      'underworldData': {
        'corruption': 0,
      },
    },
    {
      'id': 'p3c86909cda90',
      'corporations': [
        {
          'name': 'Thorgate',
          'resourceCount': 0,
          'isDisabled': false,
        },
      ],
      'pickedCorporationCard': 'Thorgate',
      'terraformRating': 20,
      'hasIncreasedTerraformRatingThisGeneration': false,
      'megaCredits': 65,
      'megaCreditProduction': 0,
      'steel': 0,
      'steelProduction': 0,
      'titanium': 0,
      'titaniumProduction': 0,
      'plants': 0,
      'plantProduction': 0,
      'energy': 1,
      'energyProduction': 1,
      'heat': 0,
      'heatProduction': 0,
      'titaniumValue': 3,
      'steelValue': 2,
      'canUseHeatAsMegaCredits': false,
      'canUsePlantsAsMegaCredits': false,
      'canUseTitaniumAsMegacredits': false,
      'canUseCorruptionAsMegacredits': false,
      'actionsTakenThisRound': 0,
      'actionsThisGeneration': [],
      'pendingInitialActions': [],
      'dealtCorporationCards': [
        'Thorgate',
        'PhoboLog',
      ],
      'dealtPreludeCards': [],
      'dealtCeoCards': [],
      'draftHand': [],
      'dealtProjectCards': [
        'Great Escarpment Consortium',
        'Building Industries',
        'Heather',
        'Magnetic Field Dome',
        'Advanced Ecosystems',
        'Release of Inert Gases',
        'Small Animals',
        'Decomposers',
        'Titanium Mine',
        'Black Polar Dust',
      ],
      'cardsInHand': [
      ],
      'preludeCardsInHand': [],
      'ceoCardsInHand': [],
      'playedCards': [],
      'draftedCards': [],
      'cardCost': 3,
      'cardDiscount': 0,
      'fleetSize': 1,
      'tradesThisGeneration': 0,
      'colonyTradeOffset': 0,
      'colonyTradeDiscount': 0,
      'colonyVictoryPoints': 0,
      'turmoilPolicyActionUsed': false,
      'politicalAgendasActionUsedCount': 0,
      'hasTurmoilScienceTagBonus': false,
      'oceanBonus': 2,
      'scienceTagCount': 0,
      'plantsNeededForGreenery': 8,
      'removingPlayers': [],
      'removedFromPlayCards': [],
      'name': 'Green',
      'color': 'green',
      'beginner': false,
      'handicap': 0,
      'timer': {
        'sumElapsed': 529866,
        'startedAt': 1717193728806,
        'running': false,
        'afterFirstAction': true,
        'lastStoppedAt': 1717194258672,
      },
      'actionsTakenThisGame': 1,
      'victoryPointsByGeneration': [
        20,
      ],
      'totalDelegatesPlaced': 0,
      'underworldData': {
        'corruption': 0,
      },
    },
  ],
  'preludeDeck': {
    'drawPile': [],
    'discardPile': [],
  },
  'projectDeck': {
    'drawPile': [
      'Fish',
      'Mine',
      'Optimal Aerobraking',
      'Sabotage',
      'Commercial District',
      'Biomass Combustors',
      'Domed Crater',
      'Business Contacts',
      'Artificial Lake',
    ],
    'discardPile': [],
  },
  'researchedPlayers': [
    'p7ff7d31b6f04',
    'p3c86909cda90',
  ],
  'seed': 0.9373359159961185,
  'someoneHasRemovedOtherPlayersPlants': false,
  'spectatorId': 'sd1c32f4c9a2',
  'temperature': -30,
  'tradeEmbargo': false,
  'underworldData': {
    'tokens': [],
  },
  'undoCount': 0,
  'unDraftedCards': [],
  'venusScaleLevel': 0,
};
