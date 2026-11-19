import {BonusCardId} from '@/common/automa/AutomaTypes';
import {CardName} from '@/common/cards/CardName';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotCorp} from '@/server/automa/MarsBotCorp';

export class RobinsonIndustriesMarsBot extends MarsBotCorp {
  constructor() {
    super({
      name: CardName.ROBINSON_INDUSTRIES,
      description: 'Setup: +10 M€. Each generation: add Diversification bonus card to action deck.',
      actionDeckBonusCard: BonusCardId.B28_DIVERSIFICATION,
    });
  }

  public override setup(marsBot: IMarsBot): void {
    marsBot.gainMc(10);
    marsBot.game.log('MarsBot (${0}): +10:r:mc:', (b) => b.cardName(this.name));
  }

  public override beforeActionPhase(marsBot: IMarsBot): void {
    marsBot.addBonusCardToActionDeck(BonusCardId.B28_DIVERSIFICATION);
  }
}
