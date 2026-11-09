import {IMarsBotCorp} from '../IMarsBotCorp';
import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {BonusCardId} from '../../../common/automa/AutomaTypes';
import {TileType} from '../../../common/TileType';
import {AutomaManifest} from './AutomaManifest';
import {whiteTrackCubes, bonusCardBeforeActionPhase} from './BaseGameCorps';

// ---- C01 Credicor ----
// Draft: most expensive card. Effect: card cost 20+ gives 4 MC.
const CREDICOR: IMarsBotCorp = {
  name: CardName.CREDICOR,
  description: 'Draft: most expensive card. Effect: card cost 20+ gives 4 MC.',
  tags: [],
  draftPriority: {type: 'mostExpensive'},
  effect: {
    onProjectCardResolved(marsBot, card) {
      if (card.cost >= 20) {
        marsBot.gainMc(4);
        marsBot.game.log(`MarsBot (Credicor): card cost ${card.cost} >= 20, gain 4 M€`);
      }
    },
  },
};

// ---- C02 Eco Line ----
// Gen effect: before action phase, add Rapid Sprouting (B23) to action deck.
const ECO_LINE: IMarsBotCorp = {
  name: CardName.ECOLINE,
  description: 'Each generation: add Rapid Sprouting bonus card to action deck. Your cards may remove or steal the plant on this card instead of from MarsBot\'s MC.',
  tags: [],
  ...bonusCardBeforeActionPhase(BonusCardId.B23_RAPID_SPROUTING, 'Eco Line'),
};

// ---- C03 Helion ----
// White cubes: instead of raising temp, draw 1 card and resolve it. A white cube on another icon
// (the Nova boards' cities) replaces nothing, so that icon resolves too.
// Black cubes: temperature rises by 1.
const HELION: IMarsBotCorp = {
  name: CardName.HELION,
  description: 'White cubes: draw and resolve a card instead of raising temperature. Black cubes: temperature +1.',
  tags: [],
  trackCubes: [
    {trackIndex: 0, position: 6, cubeType: 'white'},
    {trackIndex: 1, position: 9, cubeType: 'white'},
    {trackIndex: 3, position: 10, cubeType: 'white'},
    {trackIndex: 4, position: 5, cubeType: 'white'},
    {trackIndex: 4, position: 9, cubeType: 'white'},
    {trackIndex: 6, position: 11, cubeType: 'white'},
    {trackIndex: 5, position: 3, cubeType: 'black'},
    {trackIndex: 5, position: 6, cubeType: 'black'},
    {trackIndex: 5, position: 9, cubeType: 'black'},
    {trackIndex: 5, position: 12, cubeType: 'black'},
    {trackIndex: 5, position: 13, cubeType: 'black'},
    {trackIndex: 5, position: 14, cubeType: 'black'},
  ],
  effect: {
    onTrackCubeTrigger(marsBot, trackIndex, position, cubeType) {
      if (cubeType === 'white') {
        marsBot.maybeDrawAndResolveProjectCard();
        marsBot.game.log('MarsBot (Helion): white cube: drew and resolved card instead of temp raise');
        return marsBot.marsBotBoard.tracks[trackIndex].definition.layout[position] === 'temperature';
      }
      if (cubeType === 'black') {
        marsBot.raiseTemperature(1);
        marsBot.game.log('MarsBot (Helion): black cube: temperature +1');
      }
      return false;
    },
  },
};

// ---- C04 Interplanetary Cinematics ----
// Tags: Event, Event. Setup: replace transparent cubes on building/event tracks with white cubes.
// Effect: each advance on building (track 1) or event (track 3), earn 2 MC.
const INTERPLANETARY_CINEMATICS: IMarsBotCorp = {
  name: CardName.INTERPLANETARY_CINEMATICS,
  description: 'Tags: 2 Events. White cubes on building and event tracks. Each advance on those tracks, starting tags included, earns 2 MC.',
  tags: [Tag.EVENT, Tag.EVENT],
  trackCubes: [...whiteTrackCubes(0), ...whiteTrackCubes(2)],
  trackCubesTriggerEveryAdvance: true,
  effect: {
    onTrackCubeTrigger(marsBot, trackIndex, _position, cubeType) {
      if (cubeType === 'white' && (trackIndex === 0 || trackIndex === 2)) {
        marsBot.gainMc(2);
        marsBot.game.log('MarsBot (IC): advance on building/event track, +2 M€');
      }
    },
  },
};

// ---- C05 Inventrix ----
// Setup: remove Lobbyists (B06). Effect: card with requirements gives 2 MC.
// Gen: before action phase, add Do It Right (B25) to action deck.
const INVENTRIX: IMarsBotCorp = {
  name: CardName.INVENTRIX,
  description: 'Setup: remove Lobbyists. Effect: card with requirements gives 2 MC. Each generation: add Do It Right to action deck.',
  tags: [],
  setup(marsBot) {
    // With Venus Next the bonus deck's Lobbyists is B15
    marsBot.removeBonusCard(BonusCardId.B06_LOBBYISTS);
    marsBot.removeBonusCard(BonusCardId.B15_LOBBYISTS_VENUS);
    marsBot.game.log('MarsBot (Inventrix): Lobbyists removed from bonus deck');
  },
  effect: {
    onProjectCardResolved(marsBot, card) {
      if (card.requirements.length > 0) {
        marsBot.gainMc(2);
        marsBot.game.log('MarsBot (Inventrix): card with requirements, +2 M€');
      }
    },
  },
  ...bonusCardBeforeActionPhase(BonusCardId.B25_DO_IT_RIGHT, 'Inventrix'),
};

// ---- C06 Mining Guild ----
// Tags: Building x2. Setup: 10 MC on card.
// Effect: when earning MC, deduct from card first. When card empty, refill 10 + advance building track.
const MINING_GUILD: IMarsBotCorp = {
  name: CardName.MINING_GUILD,
  description: 'Tags: 2 Building. Setup: 10 MC on card. Until the building track reaches #18, MC MarsBot earns comes off this card; when empty, refill 10 MC, advance building track, and take the rest of the MC off the refilled card.',
  tags: [Tag.BUILDING, Tag.BUILDING],
  setup(marsBot) {
    marsBot.setCorpState('mcOnCard', 10);
    marsBot.game.log('MarsBot (Mining Guild): 10 M€ placed on card');
  },
  effect: {
    // The card is a countdown: M€ MarsBot earns is removed from the card, but the bot keeps the
    // earnings. Each time the card empties, refill 10 M€ and advance the building track, and the
    // rest of the gain comes off the refilled card. Once the game has ended the card stops, like
    // Philares (BGG 3513998).
    onMcGained(marsBot, amount) {
      if (marsBot.game.isDoneWithFinalProduction()) {
        return;
      }
      let remaining = amount;
      // Building track at #18: the card stops. The advance can reach it mid-gain.
      while (remaining > 0 && marsBot.marsBotBoard.tracks[0].position < 18) {
        const mcOnCard = marsBot.getCorpState('mcOnCard');
        const taken = Math.min(remaining, mcOnCard);
        remaining -= taken;
        if (mcOnCard - taken > 0) {
          marsBot.setCorpState('mcOnCard', mcOnCard - taken);
          return;
        }
        // Refill first: M€ the advance earns re-enters here and comes off the refilled card
        marsBot.setCorpState('mcOnCard', 10);
        marsBot.game.log('MarsBot (Mining Guild): card empty, refill 10 M€ + advance building track');
        marsBot.advanceTrack(0); // Building track = index 0
      }
    },
  },
};

// ---- C07 Phobolog ----
// Tag: Space. Setup: draw 2 space cards to bonus deck. White cubes on space track.
// Effect: white cube resolves 1 bonus card.
const PHOBOLOG: IMarsBotCorp = {
  name: CardName.PHOBOLOG,
  description: 'Tag: Space. Setup: draw 2 space cards to bonus deck. White cubes on space track: resolve 1 bonus card each.',
  tags: [Tag.SPACE],
  trackCubes: [
    {trackIndex: 1, position: 7, cubeType: 'white'},
    {trackIndex: 1, position: 10, cubeType: 'white'},
    {trackIndex: 1, position: 13, cubeType: 'white'},
    {trackIndex: 1, position: 15, cubeType: 'white'},
  ],
  setup(marsBot) {
    marsBot.addProjectCardsToBonusDeck(Tag.SPACE, 2);
    marsBot.game.log('MarsBot (Phobolog): 2 space cards drawn and added to bonus deck');
  },
  effect: {
    onTrackCubeTrigger(marsBot, _trackIndex, _position, cubeType) {
      if (cubeType === 'white') {
        marsBot.maybeDrawAndResolveBonusCard();
        marsBot.game.log('MarsBot (Phobolog): white cube: resolved 1 bonus card');
      }
    },
  },
};

// ---- C08 Saturn Systems ----
// Tags: Jovian, Space x3. Draft: Jovian > Space.
// Effect: anyone plays Jovian -> advance event track (index 2).
const SATURN_SYSTEMS: IMarsBotCorp = {
  name: CardName.SATURN_SYSTEMS,
  description: 'Tags: Jovian, 3 Space. Draft: Jovian > Space. When you play a Jovian card or MarsBot resolves a Jovian tag (starting tag included), advance event track.',
  tags: [Tag.JOVIAN, Tag.SPACE, Tag.SPACE, Tag.SPACE],
  draftPriority: {type: 'tags', tags: [Tag.JOVIAN, Tag.SPACE]},
  effect: {
    onProjectCardResolved(marsBot, card) {
      if (card.tags.includes(Tag.JOVIAN)) {
        marsBot.advanceTrack(2);
        marsBot.game.log('MarsBot (Saturn Systems): Jovian tag played, advance event track');
      }
    },
    onHumanCardPlayed(marsBot, card) {
      if (card.tags.includes(Tag.JOVIAN)) {
        marsBot.advanceTrack(2);
        marsBot.game.log('MarsBot (Saturn Systems): Human played Jovian, advance event track');
      }
    },
  },
};

// ---- C09 Teractor ----
// Draft: Earth. Setup: +25 MC, white cubes on Earth track (all positions).
// Effect: each advance on Earth track gives +2 MC.
const TERACTOR: IMarsBotCorp = {
  name: CardName.TERACTOR,
  description: 'Draft: Earth. Setup: +25 MC, white cubes on Earth track. Each Earth track advance earns 2 MC.',
  tags: [],
  draftPriority: {type: 'tags', tags: [Tag.EARTH]},
  trackCubes: whiteTrackCubes(5),
  trackCubesTriggerEveryAdvance: true,
  setup(marsBot) {
    marsBot.gainMc(25);
    marsBot.game.log('MarsBot (Teractor): +25 M€');
  },
  effect: {
    onTrackCubeTrigger(marsBot, trackIndex, _position, cubeType) {
      if (cubeType === 'white' && trackIndex === 5) {
        marsBot.gainMc(2);
        marsBot.game.log('MarsBot (Teractor): Earth track advance, +2 M€');
      }
    },
  },
};

// ---- C10 Tharsis Republic ----
// Draft: City. Setup: place 1 city. Effect: the player's city gives +2 MC; MarsBot's city advances event track.
const THARSIS_REPUBLIC: IMarsBotCorp = {
  name: CardName.THARSIS_REPUBLIC,
  description: 'Draft: City. Setup: place 1 city. When you place a city, MarsBot gains 2 MC. When MarsBot places a city (setup included), advance its event track.',
  tags: [],
  draftPriority: {type: 'tags', tags: [Tag.CITY]},
  setup(marsBot) {
    marsBot.placeCity();
    marsBot.game.log('MarsBot (Tharsis Republic): placed 1 city tile');
  },
  effect: {
    onTilePlaced(marsBot, placedByMarsBot, tileType) {
      if (tileType === TileType.CITY || tileType === TileType.CAPITAL) {
        if (placedByMarsBot) {
          marsBot.advanceTrack(2); // Event track = index 2
          marsBot.game.log('MarsBot (Tharsis Republic): MarsBot city, advance event track');
        } else {
          marsBot.gainMc(2);
          marsBot.game.log('MarsBot (Tharsis Republic): player city placed, +2 M€');
        }
      }
    },
  },
};

// ---- C11 Thorgate ----
// Tag: Power. Draft: Power. Setup: +10 MC, white cubes on energy track.
// Effect: white cube draws a card and resolves only its first tag, then temperature +1.
const THORGATE: IMarsBotCorp = {
  name: CardName.THORGATE,
  description: 'Tag: Power. Draft: Power. Setup: +10 MC, white cubes on energy track. White cube: draw a project card and resolve only its first tag, then raise temperature 1 step.',
  tags: [Tag.POWER],
  draftPriority: {type: 'tags', tags: [Tag.POWER]},
  trackCubes: [
    {trackIndex: 4, position: 4, cubeType: 'white'},
    {trackIndex: 4, position: 6, cubeType: 'white'},
    {trackIndex: 4, position: 8, cubeType: 'white'},
    {trackIndex: 4, position: 10, cubeType: 'white'},
  ],
  setup(marsBot) {
    marsBot.gainMc(10);
    marsBot.game.log('MarsBot (Thorgate): +10 M€');
  },
  effect: {
    onTrackCubeTrigger(marsBot, _trackIndex, _position, cubeType) {
      if (cubeType === 'white') {
        marsBot.maybeDrawAndResolveProjectCardFirstTagOnly();
        marsBot.raiseTemperature(1);
        marsBot.game.log('MarsBot (Thorgate): white cube: resolved card (first tag only) + temp +1');
      }
    },
  },
};

// ---- C12 UNMI ----
// Setup: add Government Subsidy (B31) to bonus deck, and take the bonus card dealt at setup back
// out of the action deck. Gen: from gen 2+, add 1 bonus card to action deck before action phase.
const UNMI: IMarsBotCorp = {
  name: CardName.UNITED_NATIONS_MARS_INITIATIVE,
  description: 'Setup: add Government Subsidy to bonus deck; no bonus card in the starting action deck. From generation 2 onward, move 1 bonus card to the action deck each generation.',
  tags: [],
  setup(marsBot) {
    // The setup bonus card was dealt before the corporation was chosen (rulebook A setup step 3)
    marsBot.returnSetupBonusCardToBonusDeck();
    marsBot.addBonusCardToBonusDeck(BonusCardId.B31_GOVERNMENT_SUBSIDY);
    marsBot.game.log('MarsBot (UNMI): Government Subsidy added to bonus deck');
  },
  beforeActionPhase(marsBot) {
    if (marsBot.game.generation >= 2) {
      marsBot.maybeMoveBonusCardToActionDeck();
      marsBot.game.log('MarsBot (UNMI): added 1 bonus card to action deck');
    }
  },
};

export const AUTOMA_BASE_MANIFEST: AutomaManifest = {
  corps: {
    [CardName.CREDICOR]: CREDICOR,
    [CardName.ECOLINE]: ECO_LINE,
    [CardName.HELION]: HELION,
    [CardName.INTERPLANETARY_CINEMATICS]: INTERPLANETARY_CINEMATICS,
    [CardName.INVENTRIX]: INVENTRIX,
    [CardName.MINING_GUILD]: MINING_GUILD,
    [CardName.PHOBOLOG]: PHOBOLOG,
    [CardName.SATURN_SYSTEMS]: SATURN_SYSTEMS,
    [CardName.TERACTOR]: TERACTOR,
    [CardName.THARSIS_REPUBLIC]: THARSIS_REPUBLIC,
    [CardName.THORGATE]: THORGATE,
    [CardName.UNITED_NATIONS_MARS_INITIATIVE]: UNMI,
  },
};
