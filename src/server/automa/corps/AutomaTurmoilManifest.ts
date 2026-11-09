import {IMarsBotCorp} from '../IMarsBotCorp';
import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {BonusCardId, LAKEFRONT_OCEAN_BONUS} from '../../../common/automa/AutomaTypes';
import {TileType} from '../../../common/TileType';
import {AutomaManifest} from './AutomaManifest';
import {bonusCardBeforeActionPhase} from './BaseGameCorps';
import {DELEGATES_PER_PLAYER} from '../../../common/constants';

// ==== TURMOIL (C35-C39) ====

// C35 Lakefront Resorts
const LAKEFRONT_RESORTS: IMarsBotCorp = {
  name: CardName.LAKEFRONT_RESORTS,
  description: 'Setup: 1 white cube on card. Oceans alternate between removing the cube (advance building track) and placing it back. Ocean adjacency pays 3 MC.',
  tags: [],
  setup(marsBot) {
    marsBot.player.oceanBonus = LAKEFRONT_OCEAN_BONUS;
    marsBot.setCorpState('whiteCubeOnCard', 1);
    marsBot.game.log('MarsBot (Lakefront): 1 white cube on card');
  },
  effect: {
    onTilePlaced(marsBot, _placedByMarsBot, tileType) {
      if (tileType === TileType.OCEAN) {
        const cube = marsBot.getCorpState('whiteCubeOnCard');
        if (cube > 0) {
          marsBot.setCorpState('whiteCubeOnCard', 0);
          const mcBefore = marsBot.megacredits;
          marsBot.advanceTrack(0); // Building track = index 0
          // FAQ (rulebook B, p.4): this overrides Government Intervention's "no M€", but not its "no TR"
          if (marsBot.mcKeptThroughIntervention !== undefined) {
            marsBot.mcKeptThroughIntervention += Math.max(0, marsBot.megacredits - mcBefore);
          }
          marsBot.game.log('MarsBot (Lakefront): ocean placed, removed cube, advance building track');
        } else {
          marsBot.setCorpState('whiteCubeOnCard', 1);
          marsBot.game.log('MarsBot (Lakefront): ocean placed, placed white cube on card');
        }
      }
    },
  },
};

// C36 Pristar (NamuWiki says "Freestar")
const PRISTAR: IMarsBotCorp = {
  name: CardName.PRISTAR,
  description: 'When a global parameter would be raised and a cube is on card: skip the raise, remove cube, +1 TR, +6 MC. Cube is restored each generation.',
  tags: [],
  effect: {
    interceptGlobalParameterRaise(marsBot, _parameter) {
      const cube = marsBot.getCorpState('whiteCubeOnCard');
      if (cube > 0) {
        marsBot.setCorpState('whiteCubeOnCard', 0);
        marsBot.raiseTR(1);
        marsBot.gainMc(6);
        marsBot.game.log('MarsBot (Pristar): parameter raise intercepted: removed cube, +1 TR, +6 M€, SKIP raise');
        return true; // SKIP the parameter raise
      }
      return false;
    },
  },
  beforeActionPhase(marsBot) {
    if (marsBot.getCorpState('whiteCubeOnCard') === 0) {
      marsBot.setCorpState('whiteCubeOnCard', 1);
      marsBot.game.log('MarsBot (Pristar): added white cube on card');
    }
  },
};

// C37 Septem Tribus
const SEPTEM_TRIBUS: IMarsBotCorp = {
  name: CardName.SEPTUM_TRIBUS,
  description: 'Setup: remove Party Politics, add Gray Eminence to bonus deck, and add all delegates of an unused colour to MarsBot\'s reserve. Each generation: add Gray Eminence to action deck.',
  tags: [],
  requiredExpansions: ['turmoil'],
  setup(marsBot) {
    marsBot.removeBonusCard(BonusCardId.B21_PARTY_POLITICS);
    marsBot.addBonusCardToBonusDeck(BonusCardId.B29_GRAY_EMINENCE);
    marsBot.game.log('MarsBot (Septem Tribus): Party Politics removed, Gray Eminence added');
    // The unused colour's delegates count as MarsBot's own.
    const turmoil = marsBot.game.turmoil;
    if (turmoil) {
      turmoil.delegateReserve.add(marsBot.player, DELEGATES_PER_PLAYER);
      marsBot.game.log(`MarsBot (Septem Tribus): ${DELEGATES_PER_PLAYER} more delegates in reserve`);
    }
  },
  ...bonusCardBeforeActionPhase(BonusCardId.B29_GRAY_EMINENCE, 'Septem Tribus'),
};

// C38 Terralabs
const TERRALABS: IMarsBotCorp = {
  name: CardName.TERRALABS_RESEARCH,
  description: 'Tag: Science. Setup: TR -8. Each generation: draw 1 card to action deck (2 cards from generation 9 onward).',
  tags: [Tag.SCIENCE],
  setup(marsBot) {
    // Reduce TR by 8
    marsBot.raiseTR(-8);
    marsBot.game.log('MarsBot (Terralabs): TR -8');
  },
  beforeActionPhase(marsBot) {
    const count = marsBot.game.generation <= 8 ? 1 : 2;
    marsBot.drawProjectCardsToActionDeck(count);
    marsBot.game.log(`MarsBot (Terralabs): drew ${count} card(s) to action deck`);
  },
};

// C39 Utopia Invest
const UTOPIA_INVEST: IMarsBotCorp = {
  name: CardName.UTOPIA_INVEST,
  description: 'Tags: Building, Space. Each generation: add Investors bonus card to action deck.',
  tags: [Tag.BUILDING, Tag.SPACE],
  ...bonusCardBeforeActionPhase(BonusCardId.B32_INVESTORS, 'Utopia Invest'),
};

export const AUTOMA_TURMOIL_MANIFEST: AutomaManifest = {
  corps: {
    [CardName.LAKEFRONT_RESORTS]: LAKEFRONT_RESORTS,
    [CardName.PRISTAR]: PRISTAR,
    [CardName.SEPTUM_TRIBUS]: SEPTEM_TRIBUS,
    [CardName.TERRALABS_RESEARCH]: TERRALABS,
    [CardName.UTOPIA_INVEST]: UTOPIA_INVEST,
  },
};
