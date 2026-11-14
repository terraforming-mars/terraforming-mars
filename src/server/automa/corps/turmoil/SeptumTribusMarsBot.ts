import {BonusCardId} from '@/common/automa/AutomaTypes';
import {CardName} from '@/common/cards/CardName';
import {DELEGATES_PER_PLAYER} from '@/common/constants';
import {IMarsBotCorp} from '@/server/automa/IMarsBotCorp';
import {bonusCardBeforeActionPhase} from '@/server/automa/corps/BaseGameCorps';

// C37 Septem Tribus
export const SEPTUM_TRIBUS_MARSBOT_CORP: IMarsBotCorp = {
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
