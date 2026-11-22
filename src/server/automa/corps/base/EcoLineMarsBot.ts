import {CardName} from '@/common/cards/CardName';
import {BonusCardName} from '@/common/automa/BonusCardName';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotCorp} from '@/server/automa/MarsBotCorp';

export class EcoLineMarsBot extends MarsBotCorp {
  constructor() {
    super({
      name: CardName.ECOLINE,
      description: 'Each generation: add Rapid Sprouting bonus card to action deck. Your cards may remove or steal the plant on this card instead of from MarsBot\'s M€.',
      actionDeckBonusCard: BonusCardName.RAPID_SPROUTING,
    });
  }

  public override beforeActionPhase(marsBot: IMarsBot): void {
    marsBot.addBonusCardToActionDeck(BonusCardName.RAPID_SPROUTING);
  }
}
