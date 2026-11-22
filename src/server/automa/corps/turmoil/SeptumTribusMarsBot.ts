import {CardName} from '@/common/cards/CardName';
import {BonusCardName} from '@/common/automa/BonusCardName';
import {DELEGATES_PER_PLAYER} from '@/common/constants';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotCorp} from '@/server/automa/MarsBotCorp';

export class SeptumTribusMarsBot extends MarsBotCorp {
  constructor() {
    super({
      name: CardName.SEPTUM_TRIBUS,
      description: 'Setup: remove Party Politics, add Gray Eminence to bonus deck, and add all delegates of an unused colour to MarsBot\'s reserve. Each generation: add Gray Eminence to action deck.',
      requiredExpansions: ['turmoil'],
      actionDeckBonusCard: BonusCardName.GRAY_EMINENCE,
    });
  }

  public override setup(marsBot: IMarsBot): void {
    marsBot.removeBonusCard(BonusCardName.PARTY_POLITICS);
    marsBot.addBonusCardToBonusDeck(BonusCardName.GRAY_EMINENCE);
    marsBot.game.log('MarsBot (${0}): ${1} removed, ${2} added',
      (b) => b.cardName(this.name).bonusCardName(BonusCardName.PARTY_POLITICS).bonusCardName(BonusCardName.GRAY_EMINENCE));
    // The unused colour's delegates count as MarsBot's own.
    const turmoil = marsBot.game.turmoil;
    if (turmoil) {
      turmoil.delegateReserve.add(marsBot.player, DELEGATES_PER_PLAYER);
      marsBot.game.log('MarsBot (${0}): ${1} more delegates in reserve', (b) => b.cardName(this.name).number(DELEGATES_PER_PLAYER));
    }
  }

  public override beforeActionPhase(marsBot: IMarsBot): void {
    marsBot.addBonusCardToActionDeck(BonusCardName.GRAY_EMINENCE);
  }
}
