import {IMarsBotCorp} from '../IMarsBotCorp';
import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {BonusCardId} from '../../../common/automa/AutomaTypes';
import {AutomaManifest} from './AutomaManifest';
import {Space} from '../../boards/Space';
import {SelectOption} from '../../inputs/SelectOption';
import {OrOptions} from '../../inputs/OrOptions';
import {message} from '../../logs/MessageBuilder';
import {Resource} from '../../../common/Resource';
import {CardResource} from '../../../common/CardResource';

// ==== PROMO (C21-C24) ====

// C21 Pharmacy Union
const PHARMACY_UNION: IMarsBotCorp = {
  name: CardName.PHARMACY_UNION,
  description: 'Tag: Science. Draft: Science. Setup: remove Meteor Shower; shuffle a revealed Science card into the bonus deck. Science cards (starting tag included) give +1 TR. When human plays a Microbe card, lose 4 MC.',
  tags: [Tag.SCIENCE],
  draftPriority: {type: 'tags', tags: [Tag.SCIENCE]},
  setup(marsBot) {
    marsBot.removeBonusCard(BonusCardId.B01_METEOR_SHOWER);
    marsBot.addProjectCardsToBonusDeck(Tag.SCIENCE, 1);
    marsBot.game.log('MarsBot (Pharmacy Union): Meteor Shower removed, science card added to bonus deck');
  },
  effect: {
    onProjectCardResolved(marsBot, card) {
      if (card.tags.includes(Tag.SCIENCE)) {
        marsBot.raiseTR(1);
        marsBot.game.log('MarsBot (Pharmacy Union): science card, TR +1');
      }
    },
    onHumanCardPlayed(marsBot, card) {
      if (card.tags.includes(Tag.MICROBE)) {
        marsBot.megacredits = Math.max(0, marsBot.megacredits - 4);
        marsBot.game.log('MarsBot (Pharmacy Union): human played microbe, -4 M€');
      }
    },
  },
};

// C22 Philares
const PHILARES: IMarsBotCorp = {
  name: CardName.PHILARES,
  description: 'Setup: place greenery, +1 science resource, resolve and remove Local Neural Instance, add Build Build Build to bonus deck. ' +
    'Each new adjacency between its tile and the player\'s tile: +1 science resource. ' +
    'Spend 4 science resources to advance the most-advanced track that is not maxed, but not after the game has ended.',
  tags: [],
  setup(marsBot) {
    marsBot.placeGreenery();
    marsBot.setCorpState('scienceResources', 1);
    marsBot.removeBonusCard(BonusCardId.B07_LOCAL_NEURAL_INSTANCE);
    marsBot.resolveBonusCard(BonusCardId.B07_LOCAL_NEURAL_INSTANCE);
    marsBot.addBonusCardToBonusDeck(BonusCardId.B27_BUILD_BUILD_BUILD);
    marsBot.game.log('MarsBot (Philares): placed greenery, +1 science resource, Local Neural Instance removed, B27 added');
  },
  effect: {
    // Oceans belong to no one, so they never make an adjacency
    onTilePlaced(marsBot, placedByMarsBot, _tileType, space) {
      if (space.player === undefined) {
        return;
      }
      const otherSide = (s: Space) => placedByMarsBot ? s.player !== marsBot.player : s.player === marsBot.player;
      const adjacencies = marsBot.game.board.getAdjacentSpaces(space)
        .filter((s) => s.tile !== undefined && s.player !== undefined && otherSide(s)).length;
      if (adjacencies === 0) {
        return;
      }
      marsBot.setCorpState('scienceResources', marsBot.getCorpState('scienceResources') + adjacencies);
      marsBot.game.log('MarsBot (Philares): +${0} science resource(s) from new adjacencies with the player', (b) => b.number(adjacencies));
      // No track advances once the game has ended (TDaver, BGG 3513998), so the science
      // resources stay unspent rather than paying for an advance that doesn't happen
      if (marsBot.game.isDoneWithFinalProduction()) {
        return;
      }
      while (marsBot.getCorpState('scienceResources') >= 4) {
        const trackIndex = marsBot.marsBotBoard.getMostAdvancedNonMaxedTrackIndex();
        if (trackIndex === undefined) {
          return;
        }
        marsBot.setCorpState('scienceResources', marsBot.getCorpState('scienceResources') - 4);
        marsBot.game.log('MarsBot (Philares): spends 4 science resources to advance its most-advanced track');
        marsBot.advanceTrack(trackIndex);
      }
    },
  },
};

// C23 Recyclone
const RECYCLONE: IMarsBotCorp = {
  name: CardName.RECYCLON,
  description: 'Tag: Microbe. Draft: Building. White cubes on building track. Each white cube advances the plant track.',
  tags: [Tag.MICROBE],
  draftPriority: {type: 'tags', tags: [Tag.BUILDING]},
  trackCubes: [
    {trackIndex: 0, position: 3, cubeType: 'white'},
    {trackIndex: 0, position: 6, cubeType: 'white'},
    {trackIndex: 0, position: 9, cubeType: 'white'},
    {trackIndex: 0, position: 12, cubeType: 'white'},
    {trackIndex: 0, position: 15, cubeType: 'white'},
    {trackIndex: 0, position: 18, cubeType: 'white'},
  ],
  effect: {
    onTrackCubeTrigger(marsBot, trackIndex, _position, cubeType) {
      if (cubeType === 'white' && trackIndex === 0) {
        marsBot.advanceTrack(6); // Plant track = index 6
        marsBot.game.log('MarsBot (Recyclone): white cube on building track: advance plant track');
      }
    },
  },
};

// C24 Splice
const SPLICE: IMarsBotCorp = {
  name: CardName.SPLICE,
  description: 'Tag: Plant. Draft: Microbe. Setup: +8 MC, remove R&D, add a Microbe card to bonus deck. Microbe cards earn 4 MC. When human plays a Microbe card, earn 2 MC and the human gains 2 MC or adds a microbe to that card.',
  tags: [Tag.PLANT],
  draftPriority: {type: 'tags', tags: [Tag.MICROBE]},
  setup(marsBot) {
    marsBot.gainMc(8);
    marsBot.removeBonusCard(BonusCardId.B03_RESEARCH_AND_DEVELOPMENT);
    marsBot.addProjectCardsToBonusDeck(Tag.MICROBE, 1);
    marsBot.game.log('MarsBot (Splice): +8 M€, R&D removed, microbe card added to bonus deck');
  },
  effect: {
    onProjectCardResolved(marsBot, card) {
      if (card.tags.includes(Tag.MICROBE)) {
        marsBot.gainMc(4);
        marsBot.game.log('MarsBot (Splice): microbe card, +4 M€');
      }
    },
    onHumanCardPlayed(marsBot, card) {
      if (!card.tags.includes(Tag.MICROBE)) {
        return;
      }
      marsBot.gainMc(2);
      marsBot.game.log('MarsBot (Splice): human played microbe, +2 M€');

      // The player gains 2 M€, or adds a microbe to the card they played
      const human = marsBot.humanPlayer;
      const gainMC = new SelectOption(message('Gain ${0} M€', (b) => b.number(2)), 'Gain M€').andThen(() => {
        human.stock.add(Resource.MEGACREDITS, 2, {log: true});
        return undefined;
      });
      if (card.resourceType === CardResource.MICROBE) {
        const addMicrobe = new SelectOption('Add a microbe resource to this card', 'Add microbe').andThen(() => {
          human.addResourceTo(card, {log: true});
          return undefined;
        });
        human.defer(new OrOptions(addMicrobe, gainMC));
      } else {
        gainMC.cb(undefined);
      }
    },
  },
};

export const AUTOMA_PROMO_MANIFEST: AutomaManifest = {
  corps: {
    [CardName.PHARMACY_UNION]: PHARMACY_UNION,
    [CardName.PHILARES]: PHILARES,
    [CardName.RECYCLON]: RECYCLONE,
    [CardName.SPLICE]: SPLICE,
  },
};
