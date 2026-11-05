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
  setup(bot) {
    bot.player.oceanBonus = LAKEFRONT_OCEAN_BONUS;
    bot.setCorpState('whiteCubeOnCard', 1);
    bot.game.log('MarsBot (Lakefront): 1 white cube on card');
  },
  effect: {
    onTilePlaced(bot, _placedByMarsBot, tileType) {
      if (tileType === TileType.OCEAN) {
        const cube = bot.getCorpState('whiteCubeOnCard');
        if (cube > 0) {
          bot.setCorpState('whiteCubeOnCard', 0);
          const mcBefore = bot.megacredits;
          bot.advanceTrack(0); // Building track = index 0
          // FAQ (rulebook B, p.3): this overrides Government Intervention's "no M€", but not its "no TR"
          if (bot.mcKeptThroughIntervention !== undefined) {
            bot.mcKeptThroughIntervention += Math.max(0, bot.megacredits - mcBefore);
          }
          bot.game.log('MarsBot (Lakefront): ocean placed, removed cube, advance building track');
        } else {
          bot.setCorpState('whiteCubeOnCard', 1);
          bot.game.log('MarsBot (Lakefront): ocean placed, placed white cube on card');
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
    interceptGlobalParameterRaise(bot, _parameter) {
      const cube = bot.getCorpState('whiteCubeOnCard');
      if (cube > 0) {
        bot.setCorpState('whiteCubeOnCard', 0);
        bot.raiseTR(1);
        bot.gainMc(6);
        bot.game.log('MarsBot (Pristar): parameter raise intercepted: removed cube, +1 TR, +6 M€, SKIP raise');
        return true; // SKIP the parameter raise
      }
      return false;
    },
  },
  beforeActionPhase(bot) {
    if (bot.getCorpState('whiteCubeOnCard') === 0) {
      bot.setCorpState('whiteCubeOnCard', 1);
      bot.game.log('MarsBot (Pristar): added white cube on card');
    }
  },
};

// C37 Septem Tribus
const SEPTEM_TRIBUS: IMarsBotCorp = {
  name: CardName.SEPTUM_TRIBUS,
  description: 'Setup: remove Party Politics, add Gray Eminence to bonus deck, and add all delegates of an unused colour to MarsBot\'s reserve. Each generation: add Gray Eminence to action deck.',
  tags: [],
  requiredExpansions: ['turmoil'],
  setup(bot) {
    bot.removeBonusCard(BonusCardId.B21_PARTY_POLITICS);
    bot.addBonusCardToBonusDeck(BonusCardId.B29_GRAY_EMINENCE);
    bot.game.log('MarsBot (Septem Tribus): Party Politics removed, Gray Eminence added');
    // The unused colour's delegates count as MarsBot's own.
    const turmoil = bot.game.turmoil;
    if (turmoil) {
      turmoil.delegateReserve.add(bot.player, DELEGATES_PER_PLAYER);
      bot.game.log(`MarsBot (Septem Tribus): ${DELEGATES_PER_PLAYER} more delegates in reserve`);
    }
  },
  ...bonusCardBeforeActionPhase(BonusCardId.B29_GRAY_EMINENCE, 'Septem Tribus'),
};

// C38 Terralabs
const TERRALABS: IMarsBotCorp = {
  name: CardName.TERRALABS_RESEARCH,
  description: 'Tag: Science. Setup: TR -8. Each generation: draw 1 card to action deck (2 cards from generation 9 onward).',
  tags: [Tag.SCIENCE],
  setup(bot) {
    // Reduce TR by 8
    bot.raiseTR(-8);
    bot.game.log('MarsBot (Terralabs): TR -8');
  },
  beforeActionPhase(bot) {
    const count = bot.game.generation <= 8 ? 1 : 2;
    bot.drawProjectCardsToActionDeck(count);
    bot.game.log(`MarsBot (Terralabs): drew ${count} card(s) to action deck`);
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
