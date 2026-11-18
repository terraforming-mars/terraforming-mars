import {BonusCardId} from '@/common/automa/AutomaTypes';
import {CardName} from '@/common/cards/CardName';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotCorp} from '@/server/automa/MarsBotCorp';
import {addBonusCardBeforeActionPhase} from '@/server/automa/corps/BaseGameCorps';

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
    marsBot.game.log('MarsBot (Robinson Industries): +10 M€');
  }

  public override beforeActionPhase(marsBot: IMarsBot): void {
    addBonusCardBeforeActionPhase(marsBot, BonusCardId.B28_DIVERSIFICATION, 'Robinson Industries');
  }
}
