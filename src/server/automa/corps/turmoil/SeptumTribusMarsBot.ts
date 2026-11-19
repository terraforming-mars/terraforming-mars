import {BonusCardId} from '@/common/automa/AutomaTypes';
import {CardName} from '@/common/cards/CardName';
import {DELEGATES_PER_PLAYER} from '@/common/constants';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotCorp} from '@/server/automa/MarsBotCorp';
import {addBonusCardBeforeActionPhase} from '@/server/automa/corps/corpHelpers';

export class SeptumTribusMarsBot extends MarsBotCorp {
  constructor() {
    super({
      name: CardName.SEPTUM_TRIBUS,
      description: 'Setup: remove Party Politics, add Gray Eminence to bonus deck, and add all delegates of an unused colour to MarsBot\'s reserve. Each generation: add Gray Eminence to action deck.',
      requiredExpansions: ['turmoil'],
      actionDeckBonusCard: BonusCardId.B29_GRAY_EMINENCE,
    });
  }

  public override setup(marsBot: IMarsBot): void {
    marsBot.removeBonusCard(BonusCardId.B21_PARTY_POLITICS);
    marsBot.addBonusCardToBonusDeck(BonusCardId.B29_GRAY_EMINENCE);
    marsBot.game.log('MarsBot (${0}): Party Politics removed, Gray Eminence added', (b) => b.cardName(this.name));
    // The unused colour's delegates count as MarsBot's own.
    const turmoil = marsBot.game.turmoil;
    if (turmoil) {
      turmoil.delegateReserve.add(marsBot.player, DELEGATES_PER_PLAYER);
      marsBot.game.log('MarsBot (${0}): ${1} more delegates in reserve', (b) => b.cardName(this.name).number(DELEGATES_PER_PLAYER));
    }
  }

  public override beforeActionPhase(marsBot: IMarsBot): void {
    addBonusCardBeforeActionPhase(marsBot, BonusCardId.B29_GRAY_EMINENCE, this.name);
  }
}
