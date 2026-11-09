import {IMarsBotCorp} from '../IMarsBotCorp';
import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {BonusCardId} from '../../../common/automa/AutomaTypes';
import {AutomaManifest} from './AutomaManifest';
import {floaterAtRoundStart, SILVER_CUBE_MC} from './BaseGameCorps';
import {CardType} from '../../../common/cards/CardType';
import {isIActionCard} from '../../cards/ICard';

// ==== VENUS NEXT (C25-C28, C34) ====

// C25 Viron (NamuWiki says "Byron")
const VIRON: IMarsBotCorp = {
  name: CardName.VIRON,
  description: 'Tag: Microbe. Each active card with an action adds 1 floater and scores 1 VP at game end.',
  tags: [Tag.MICROBE],
  requiredExpansions: ['venus', 'colonies'],
  effect: {
    onProjectCardResolved(marsBot, card) {
      if (card.type !== CardType.ACTIVE || !isIActionCard(card)) {
        return;
      }
      marsBot.addFloaters(1);
      marsBot.setCorpState('actionCardsPlayed', marsBot.getCorpState('actionCardsPlayed') + 1);
      marsBot.game.log('MarsBot (Viron): active card with an action played, +1 floater');
    },
    vpBonus(marsBot) {
      return marsBot.getCorpState('actionCardsPlayed');
    },
  },
};

// C26 Celestic
const CELESTIC: IMarsBotCorp = {
  name: CardName.CELESTIC,
  description: 'Tag: Venus. Draft: Venus > Jovian. Setup: +1 floater. Each Failed Action: +1 floater. Each round start: +1 floater.',
  tags: [Tag.VENUS],
  requiredExpansions: ['venus', 'colonies'],
  draftPriority: {type: 'tags', tags: [Tag.VENUS, Tag.JOVIAN]},
  setup(marsBot) {
    marsBot.addFloaters(1);
    marsBot.game.log('MarsBot (Celestic): +1 floater');
  },
  effect: {
    onFailedAction(marsBot) {
      marsBot.addFloaters(1);
      marsBot.game.log('MarsBot (Celestic): Failed Action, +1 floater');
    },
  },
  roundStart: floaterAtRoundStart('Celestic'),
};

// C27 Morningstar Inc.
const MORNINGSTAR: IMarsBotCorp = {
  name: CardName.MORNING_STAR_INC,
  description: 'Tags: 2 Venus. Setup: remove Lobbyists, add Venusian Lobby. Silver resource cubes on Venus track earn 5 MC each.',
  tags: [Tag.VENUS, Tag.VENUS],
  requiredExpansions: ['venus'],
  setup(marsBot) {
    // With Venus Next the bonus deck's Lobbyists is B15
    marsBot.removeBonusCard(BonusCardId.B06_LOBBYISTS);
    marsBot.removeBonusCard(BonusCardId.B15_LOBBYISTS_VENUS);
    marsBot.addBonusCardToBonusDeck(BonusCardId.B26_VENUSIAN_LOBBY);
    marsBot.game.log('MarsBot (Morningstar): Lobbyists removed, Venusian Lobby added');
  },
  // Silver resource cubes on the Venus track (index 7, present only on the Venus board) at positions 5-9 and 11-12.
  trackCubes: [5, 6, 7, 8, 9, 11, 12].map((position) => ({trackIndex: 7, position, cubeType: 'credit' as const})),
  effect: {
    onTrackCubeTrigger(marsBot, _trackIndex, _position, cubeType) {
      if (cubeType === 'credit') {
        marsBot.gainMc(SILVER_CUBE_MC);
        marsBot.game.log('MarsBot (Morningstar): silver resource cube, +5 M€');
      }
    },
  },
};

// C28 Aphrodite
const APHRODITE: IMarsBotCorp = {
  name: CardName.APHRODITE,
  description: 'Tag: Plant. Draft: Plant > Animal > Venus. Whenever Venus is raised, earn 2 MC per step.',
  tags: [Tag.PLANT],
  requiredExpansions: ['venus'],
  draftPriority: {type: 'tags', tags: [Tag.PLANT, Tag.ANIMAL, Tag.VENUS]},
  effect: {
    onVenusRaised(marsBot, steps) {
      const mc = 2 * steps;
      marsBot.gainMc(mc);
      marsBot.game.log('MarsBot (Aphrodite): Venus raised ${0} step(s), +${1} M€', (b) => b.number(steps).number(mc));
    },
  },
};

// C34 Stormcraft
const STORMCRAFT: IMarsBotCorp = {
  name: CardName.STORMCRAFT_INCORPORATED,
  description: 'Tag: Jovian. Setup: +1 floater. Each round start: +1 floater. Spending floaters for an extra card also raises temperature +1.',
  tags: [Tag.JOVIAN],
  requiredExpansions: ['venus', 'colonies'],
  setup(marsBot) {
    marsBot.addFloaters(1);
    marsBot.game.log('MarsBot (Stormcraft): +1 floater');
  },
  effect: {
    onFloatersSpentForExtraCard(marsBot) {
      marsBot.raiseTemperature(1);
      marsBot.game.log('MarsBot (Stormcraft): floaters spent for an extra card, temperature +1');
    },
  },
  roundStart: floaterAtRoundStart('Stormcraft'),
};

export const AUTOMA_VENUS_MANIFEST: AutomaManifest = {
  corps: {
    [CardName.VIRON]: VIRON,
    [CardName.CELESTIC]: CELESTIC,
    [CardName.MORNING_STAR_INC]: MORNINGSTAR,
    [CardName.APHRODITE]: APHRODITE,
    [CardName.STORMCRAFT_INCORPORATED]: STORMCRAFT,
  },
};
