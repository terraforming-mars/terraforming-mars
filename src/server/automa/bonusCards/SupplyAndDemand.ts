import {BonusCardId} from '@/common/automa/AutomaTypes';
import {CardName} from '@/common/cards/CardName';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotBonusCard} from '@/server/automa/MarsBotBonusCard';

export class SupplyAndDemand extends MarsBotBonusCard {
  constructor() {
    super({id: BonusCardId.B24_SUPPLY_AND_DEMAND, name: CardName.AUTOMA_SUPPLY_AND_DEMAND});
  }

  public override resolve(marsBot: IMarsBot): boolean {
    const taken = Math.min(3, marsBot.getCorpState('mcOnCard'));
    if (taken > 0) {
      marsBot.setCorpState('mcOnCard', marsBot.getCorpState('mcOnCard') - taken);
      marsBot.gainMc(taken);
      marsBot.game.log('MarsBot (${0}): takes ${1}:r:mc: from the corporation card', (b) => b.cardName(this.name).number(taken));
    } else {
      marsBot.maybeAdvanceTrack(4);
      marsBot.game.log('MarsBot (${0}): advance energy track', (b) => b.cardName(this.name));
    }
    return false;
  }
}
