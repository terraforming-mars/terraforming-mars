import {BonusCardId} from '@/common/automa/AutomaTypes';
import {CardName} from '@/common/cards/CardName';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotCorp} from '@/server/automa/MarsBotCorp';

export class EcoLineMarsBot extends MarsBotCorp {
  constructor() {
    super({
      name: CardName.ECOLINE,
      description: 'Each generation: add Rapid Sprouting bonus card to action deck. Your cards may remove or steal the plant on this card instead of from MarsBot\'s M€.',
      actionDeckBonusCard: BonusCardId.B23_RAPID_SPROUTING,
    });
  }

  public override beforeActionPhase(marsBot: IMarsBot): void {
    marsBot.addBonusCardToActionDeck(BonusCardId.B23_RAPID_SPROUTING);
  }
}
