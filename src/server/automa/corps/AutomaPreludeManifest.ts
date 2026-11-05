import {IMarsBotCorp} from '../IMarsBotCorp';
import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {BonusCardId} from '../../../common/automa/AutomaTypes';
import {AutomaManifest} from './AutomaManifest';
import {whiteTrackCubes, bonusCardBeforeActionPhase, whiteLeastBlackSpaceHandler, SILVER_CUBE_MC} from './BaseGameCorps';
import {cardTagsIncludingEvent, printedVictoryPoints} from '../MarsBotTags';

// ==== PRELUDE (C13-C17) ====

// C13 Cheung Shing MARS: silver resource cubes on building track from position 4
const CHEUNG_SHING_MARS: IMarsBotCorp = {
  name: CardName.CHEUNG_SHING_MARS,
  description: 'Tag: Building. Draft: Building. Silver resource cubes on building track from position 4; each earns 5 MC.',
  tags: [Tag.BUILDING],
  draftPriority: {type: 'tags', tags: [Tag.BUILDING]},
  // Silver resource cubes at positions 4-18 on building track (track 1)
  trackCubes: Array.from({length: 15}, (_, i) => ({trackIndex: 0, position: i + 4, cubeType: 'credit' as const})),
  effect: {
    onTrackCubeTrigger(bot, _trackIndex, _position, cubeType) {
      if (cubeType === 'credit') {
        bot.gainMc(SILVER_CUBE_MC);
        bot.game.log('MarsBot (Cheung Shing): silver resource cube reached, +5 M€');
      }
    },
  },
};

// C14 Point Luna: white+black cubes on Earth track (track 6)
const POINT_LUNA: IMarsBotCorp = {
  name: CardName.POINT_LUNA,
  description: 'Tag: Space. Draft: Earth. White and black cubes on Earth track. White: advance least-advanced track. Black: advance space track.',
  tags: [Tag.SPACE],
  draftPriority: {type: 'tags', tags: [Tag.EARTH]},
  trackCubes: [
    {trackIndex: 5, position: 1, cubeType: 'white'},
    {trackIndex: 5, position: 5, cubeType: 'white'},
    {trackIndex: 5, position: 9, cubeType: 'white'},
    {trackIndex: 5, position: 13, cubeType: 'white'},
    {trackIndex: 5, position: 17, cubeType: 'white'},
    {trackIndex: 5, position: 3, cubeType: 'black'},
    {trackIndex: 5, position: 7, cubeType: 'black'},
    {trackIndex: 5, position: 11, cubeType: 'black'},
    {trackIndex: 5, position: 15, cubeType: 'black'},
  ],
  effect: {
    onTrackCubeTrigger(bot, _trackIndex, _position, cubeType) {
      whiteLeastBlackSpaceHandler(bot, cubeType, 'Point Luna');
    },
  },
};

// C15 Robinson Industries
const ROBINSON_INDUSTRIES: IMarsBotCorp = {
  name: CardName.ROBINSON_INDUSTRIES,
  description: 'Setup: +10 MC. Each generation: add Diversification bonus card to action deck.',
  tags: [],
  setup(bot) {
    bot.gainMc(10);
    bot.game.log('MarsBot (Robinson Industries): +10 M€');
  },
  ...bonusCardBeforeActionPhase(BonusCardId.B28_DIVERSIFICATION, 'Robinson Industries'),
};

// C16 Valley Trust
const VALLEY_TRUST: IMarsBotCorp = {
  name: CardName.VALLEY_TRUST,
  description: 'Draft: Science. Setup: draw 1 card. White cubes on science track: draw and resolve a card each.',
  tags: [],
  requiredExpansions: ['prelude'],
  draftPriority: {type: 'tags', tags: [Tag.SCIENCE]},
  setup(bot) {
    bot.drawProjectCardsToActionDeck(1); // "Obtain 1 card"
    bot.game.log('MarsBot (Valley Trust): drew 1 card');
  },
  trackCubes: [
    {trackIndex: 3, position: 8, cubeType: 'white'},
    {trackIndex: 3, position: 16, cubeType: 'white'},
  ],
  effect: {
    onTrackCubeTrigger(bot, _trackIndex, _position, cubeType) {
      if (cubeType === 'white') {
        bot.maybeDrawAndResolveProjectCard();
        bot.game.log('MarsBot (Valley Trust): white cube: drew and resolved 1 card');
      }
    },
  },
};

// C17 Vitor: separates B04, adds it to action deck each gen
const VITOR: IMarsBotCorp = {
  name: CardName.VITOR,
  description: 'Setup: separate Overachievement from bonus deck. Cards with non-negative VP earn 3 MC. Each generation: add Overachievement to action deck, until it is removed.',
  tags: [],
  setup(bot) {
    bot.removeBonusCard(BonusCardId.B04_OVERACHIEVEMENT);
    bot.game.log('MarsBot (Vitor): Overachievement separated from bonus deck');
  },
  effect: {
    onProjectCardResolved(bot, card) {
      // The VP printed on the card counts, not what it scores right now
      const printedVp = printedVictoryPoints(card);
      if (printedVp !== undefined && printedVp >= 0) {
        bot.gainMc(3);
        bot.game.log('MarsBot (Vitor): non-negative VP card, +3 M€');
      }
    },
  },
  ...bonusCardBeforeActionPhase(BonusCardId.B04_OVERACHIEVEMENT, 'Vitor'),
};

// ==== PROMO, VENUS NEXT AND PRELUDE 2 (C18-C20, C29, C40-C46) ====

// C18 Acadian Community
const ACADIAN_COMMUNITY: IMarsBotCorp = {
  name: CardName.ARCADIAN_COMMUNITIES,
  description: 'Tag: Building. Setup: resolve Settlers immediately. Each generation: add Settlers to action deck. ' +
    'Spaces with its player markers are reserved for it. Each tile it places on one of them earns 3 MC.',
  tags: [Tag.BUILDING],
  setup(bot) {
    bot.resolveBonusCard(BonusCardId.B22_SETTLERS);
  },
  effect: {
    onTilePlaced(bot, placedByMarsBot, _tileType, space) {
      if (placedByMarsBot && bot.removeMarker(space)) {
        bot.gainMc(3);
        bot.game.log('MarsBot (Acadian Community): tile on its player marker, +3 M€');
      }
    },
  },
  ...bonusCardBeforeActionPhase(BonusCardId.B22_SETTLERS, 'Acadian Community'),
};

// C19 Astrodrill Enterprise: white+black cubes on space track
const ASTRODRILL_ENTERPRISE: IMarsBotCorp = {
  name: CardName.ASTRODRILL,
  description: 'Draft: Space. White and black cubes on space track. White: advance least-advanced track. Black: advance space track.',
  tags: [],
  draftPriority: {type: 'tags', tags: [Tag.SPACE]},
  trackCubes: [
    {trackIndex: 1, position: 2, cubeType: 'white'},
    {trackIndex: 1, position: 4, cubeType: 'white'},
    {trackIndex: 1, position: 7, cubeType: 'white'},
    {trackIndex: 1, position: 10, cubeType: 'white'},
    {trackIndex: 1, position: 13, cubeType: 'white'},
    {trackIndex: 1, position: 5, cubeType: 'black'},
    {trackIndex: 1, position: 11, cubeType: 'black'},
    {trackIndex: 1, position: 16, cubeType: 'black'},
  ],
  effect: {
    onTrackCubeTrigger(bot, _trackIndex, _position, cubeType) {
      whiteLeastBlackSpaceHandler(bot, cubeType, 'Astrodrill');
    },
  },
};

// C20 Factorum
const FACTORUM: IMarsBotCorp = {
  name: CardName.FACTORUM,
  description: 'Tag: Power. White cubes on building track: each advance stores 1 MC on card. Each generation: add Supply and Demand to action deck.',
  tags: [Tag.POWER],
  trackCubes: whiteTrackCubes(0),
  trackCubesTriggerEveryAdvance: true,
  effect: {
    onTrackCubeTrigger(bot, trackIndex, _position, cubeType) {
      if (cubeType === 'white' && trackIndex === 0) {
        const mc = bot.getCorpState('mcOnCard') + 1;
        bot.setCorpState('mcOnCard', mc);
        bot.game.log(`MarsBot (Factorum): building track advance, +1 M€ on card (${mc} total)`);
      }
    },
  },
  ...bonusCardBeforeActionPhase(BonusCardId.B24_SUPPLY_AND_DEMAND, 'Factorum'),
};

// C29 Manutech: black reminder cubes at #5/#12 on each track
const MANUTECH: IMarsBotCorp = {
  name: CardName.MANUTECH,
  description: 'Tag: Building. When any track (including Venus) reaches #5 or #12, after resolving that space, advance it one more space and resolve that one too.',
  tags: [Tag.BUILDING],
  // Track 7 is Venus. Setup leaves out cubes for tracks the bot does not have.
  trackCubes: Array.from({length: 8}, (_, i) => [
    {trackIndex: i, position: 5, cubeType: 'black' as const},
    {trackIndex: i, position: 12, cubeType: 'black' as const},
  ]).flat(),
  effect: {
    afterTrackSpaceResolved(bot, trackIndex, position) {
      if (position === 5 || position === 12) {
        bot.game.log(`MarsBot (Manutech): track ${trackIndex + 1} reached #${position}, advance 1 more`);
        bot.advanceTrack(trackIndex);
      }
    },
  },
};

// C40 Ecotec
const ECOTEC: IMarsBotCorp = {
  name: CardName.ECOTEC,
  description: 'Tag: Plant. Draft: Plant > Microbe > Animal. Setup: 2 plant resources on card. Each Plant, Microbe or Animal tag (starting tag included) adds 1. Before the action phase, at 5+, spend 5 to advance plant track. Your cards may remove or steal plants from this card instead of from MarsBot\'s MC.',
  tags: [Tag.PLANT],
  draftPriority: {type: 'tags', tags: [Tag.PLANT, Tag.MICROBE, Tag.ANIMAL]},
  trackCubes: whiteTrackCubes(6),
  setup(bot) {
    bot.setCorpState('plantResources', 2);
    bot.game.log('MarsBot (Ecotec): 2 plant resources on card');
  },
  effect: {
    // Per tag, so a card with two plant tags adds two plants (rulebook B, p.1 card C40)
    onTagResolved(bot, tag) {
      if (tag === Tag.PLANT || tag === Tag.MICROBE || tag === Tag.ANIMAL) {
        bot.setCorpState('plantResources', bot.getCorpState('plantResources') + 1);
        bot.game.log('MarsBot (Ecotec): Plant/Microbe/Animal tag, +1 plant resource on card');
      }
    },
  },
  beforeActionPhase(bot) {
    const plants = bot.getCorpState('plantResources');
    if (plants >= 5) {
      bot.setCorpState('plantResources', plants - 5);
      bot.advanceTrack(6); // Plant track = index 6
      bot.game.log('MarsBot (Ecotec): spent 5 plant resources, advance plant track');
    }
  },
};

// C41 Kuiper Cooperative
const KUIPER_COOPERATIVE: IMarsBotCorp = {
  name: CardName.KUIPER_COOPERATIVE,
  description: 'Tag: Space. Draft: Space. White and black cubes on space track. White: temperature +1. Black: place ocean.',
  tags: [Tag.SPACE],
  draftPriority: {type: 'tags', tags: [Tag.SPACE]},
  trackCubes: [
    {trackIndex: 1, position: 4, cubeType: 'white'},
    {trackIndex: 1, position: 8, cubeType: 'white'},
    {trackIndex: 1, position: 12, cubeType: 'white'},
    {trackIndex: 1, position: 7, cubeType: 'black'},
    {trackIndex: 1, position: 10, cubeType: 'black'},
    {trackIndex: 1, position: 14, cubeType: 'black'},
  ],
  effect: {
    onTrackCubeTrigger(bot, _trackIndex, _position, cubeType) {
      if (cubeType === 'white') {
        bot.raiseTemperature(1);
        bot.game.log('MarsBot (Kuiper): white cube: temperature +1');
      } else if (cubeType === 'black') {
        bot.placeOcean();
        bot.game.log('MarsBot (Kuiper): black cube: place ocean');
      }
    },
  },
};

// C42 Nirgal Enterprises
const NIRGAL_ENTERPRISES: IMarsBotCorp = {
  name: CardName.NIRGAL_ENTERPRISES,
  description: 'Tags: Building, Power, Plant. Setup: remove Overachievement. +2 in every award. Generations 2-5 and 10+: claim milestone. Generations 6-9: fund award.',
  tags: [Tag.BUILDING, Tag.POWER, Tag.PLANT],
  setup(bot) {
    bot.removeBonusCard(BonusCardId.B04_OVERACHIEVEMENT);
    bot.game.log('MarsBot (Nirgal): Overachievement removed from bonus deck');
  },
  effect: {
    awardScoreBonus() {
      return 2;
    },
  },
  // Gen 2-5 or 10+: claim milestone. Gen 6-9: fund award. Neither is a Failed Action when it can't.
  beforeActionPhase(bot) {
    const generation = bot.game.generation;
    if ((generation >= 2 && generation <= 5) || generation >= 10) {
      if (!bot.maybeClaimMilestone()) {
        bot.game.log('MarsBot (Nirgal): no milestone to claim');
      }
    } else if (generation >= 6 && generation <= 9) {
      if (!bot.maybeFundAward()) {
        bot.game.log('MarsBot (Nirgal): no award to fund');
      }
    }
  },
};

// C43 Paladin Shipping
const PALADIN_SHIPPING: IMarsBotCorp = {
  name: CardName.PALLADIN_SHIPPING,
  description: 'Tags: Space, Event. Draft: Space > Event. Setup: +5 MC. Cubes on space and event tracks are collected; when a white and black pair is collected, temperature +1.',
  tags: [Tag.SPACE, Tag.EVENT],
  draftPriority: {type: 'tags', tags: [Tag.SPACE, Tag.EVENT]},
  setup(bot) {
    bot.gainMc(5);
    bot.game.log('MarsBot (Paladin): +5 M€');
  },
  trackCubes: [
    {trackIndex: 1, position: 3, cubeType: 'white'},
    {trackIndex: 1, position: 4, cubeType: 'white'},
    {trackIndex: 1, position: 6, cubeType: 'white'},
    {trackIndex: 1, position: 8, cubeType: 'white'},
    {trackIndex: 1, position: 10, cubeType: 'white'},
    {trackIndex: 1, position: 11, cubeType: 'white'},
    {trackIndex: 2, position: 3, cubeType: 'black'},
    {trackIndex: 2, position: 4, cubeType: 'black'},
    {trackIndex: 2, position: 6, cubeType: 'black'},
    {trackIndex: 2, position: 8, cubeType: 'black'},
    {trackIndex: 2, position: 10, cubeType: 'black'},
    {trackIndex: 2, position: 11, cubeType: 'black'},
  ],
  effect: {
    onTrackCubeTrigger(bot, _trackIndex, _position, cubeType) {
      // Collect cube onto card. If 2 colors present, remove pair + temp +1
      const key = cubeType === 'white' ? 'whiteCubesOnCard' : 'blackCubesOnCard';
      bot.setCorpState(key, bot.getCorpState(key) + 1);
      const white = bot.getCorpState('whiteCubesOnCard');
      const black = bot.getCorpState('blackCubesOnCard');
      if (white > 0 && black > 0) {
        bot.setCorpState('whiteCubesOnCard', white - 1);
        bot.setCorpState('blackCubesOnCard', black - 1);
        bot.raiseTemperature(1);
        bot.game.log('MarsBot (Paladin): paired cubes: temperature +1');
      } else {
        bot.game.log(`MarsBot (Paladin): ${cubeType} cube collected (W:${bot.getCorpState('whiteCubesOnCard')}, B:${bot.getCorpState('blackCubesOnCard')})`);
      }
    },
  },
};

// C44 Sagitta
const SAGITTA: IMarsBotCorp = {
  name: CardName.SAGITTA_FRONTIER_SERVICES,
  description: 'Tags: Power, Event. Setup: +8 MC. Tagless cards pay double the Failed Action (10 MC instead of 5). 1-tag cards earn 1 extra MC.',
  tags: [Tag.POWER, Tag.EVENT],
  setup(bot) {
    bot.gainMc(8);
    bot.game.log('MarsBot (Sagitta): +8 M€');
  },
  effect: {
    // Tagless card: double the Failed Action (10 MC instead of 5, 6 instead of 3 on Easy). 1-tag card: +1 MC.
    onProjectCardResolved(bot, card) {
      const tagCount = cardTagsIncludingEvent(card).length;
      if (tagCount === 0) {
        const extra = bot.failedActionMc;
        bot.gainMc(extra);
        bot.game.log('MarsBot (Sagitta): tagless card, Failed Action pays ${0} M€ more', (b) => b.number(extra));
      } else if (tagCount === 1) {
        bot.gainMc(1);
        bot.game.log('MarsBot (Sagitta): 1-tag card, +1 M€');
      }
    },
  },
};

// C45 Spire
const SPIRE: IMarsBotCorp = {
  name: CardName.SPIRE,
  description: 'Tag: Earth. Draft: card with most tags. Cards with 2+ tags add 1 science resource. Spend 10 science to place a city and gain 1 TR.',
  tags: [Tag.EARTH],
  draftPriority: {type: 'mostTags'},
  effect: {
    onProjectCardResolved(bot, card) {
      const tagCount = cardTagsIncludingEvent(card).length;
      if (tagCount >= 2) {
        bot.setCorpState('scienceResources', bot.getCorpState('scienceResources') + 1);
        bot.game.log(`MarsBot (Spire): card with ${tagCount} tags, +1 science resource`);
      }
    },
  },
  beforeActionPhase(bot) {
    const science = bot.getCorpState('scienceResources');
    if (science >= 10) {
      bot.setCorpState('scienceResources', science - 10);
      bot.placeCity();
      bot.raiseTR(1);
      bot.game.log('MarsBot (Spire): spent 10 science, placed city + TR +1');
    }
  },
};

// C46 Tyco Magnetics
const TYCO_MAGNETICS: IMarsBotCorp = {
  name: CardName.TYCHO_MAGNETICS,
  description: 'Draft: Power > Science. Setup: add Interface Hyperlink to the bottom of the bonus deck.',
  tags: [],
  draftPriority: {type: 'tags', tags: [Tag.POWER, Tag.SCIENCE]},
  setup(bot) {
    bot.addBonusCardToBottomOfBonusDeck(BonusCardId.B30_INTERFACE_HYPERLINK);
    bot.game.log('MarsBot (Tyco Magnetics): Interface Hyperlink added to the bottom of the bonus deck');
  },
};

export const AUTOMA_PRELUDE_MANIFEST: AutomaManifest = {
  corps: {
    // Prelude
    [CardName.CHEUNG_SHING_MARS]: CHEUNG_SHING_MARS,
    [CardName.POINT_LUNA]: POINT_LUNA,
    [CardName.ROBINSON_INDUSTRIES]: ROBINSON_INDUSTRIES,
    [CardName.VALLEY_TRUST]: VALLEY_TRUST,
    [CardName.VITOR]: VITOR,
    // Prelude 2
    [CardName.ARCADIAN_COMMUNITIES]: ACADIAN_COMMUNITY,
    [CardName.ASTRODRILL]: ASTRODRILL_ENTERPRISE,
    [CardName.FACTORUM]: FACTORUM,
    [CardName.MANUTECH]: MANUTECH,
    [CardName.ECOTEC]: ECOTEC,
    [CardName.KUIPER_COOPERATIVE]: KUIPER_COOPERATIVE,
    [CardName.NIRGAL_ENTERPRISES]: NIRGAL_ENTERPRISES,
    [CardName.PALLADIN_SHIPPING]: PALADIN_SHIPPING,
    [CardName.SAGITTA_FRONTIER_SERVICES]: SAGITTA,
    [CardName.SPIRE]: SPIRE,
    [CardName.TYCHO_MAGNETICS]: TYCO_MAGNETICS,
  },
};
