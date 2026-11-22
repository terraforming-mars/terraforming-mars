import {IMarsBot} from '@/server/automa/IMarsBot';
import {BonusCardName} from '@/common/automa/BonusCardName';
import {MarsBotBonusCard} from '@/server/automa/bonusCards/MarsBotBonusCard';

export class SupplyAndDemand extends MarsBotBonusCard {
  constructor() {
    super(BonusCardName.SUPPLY_AND_DEMAND);
  }

  public override resolve(marsBot: IMarsBot): boolean {
    const taken = Math.min(3, marsBot.getCorpState('mcOnCard'));
    if (taken > 0) {
      marsBot.setCorpState('mcOnCard', marsBot.getCorpState('mcOnCard') - taken);
      marsBot.gainMc(taken);
      marsBot.game.log('MarsBot (${0}): takes ${1}:r:mc: from the corporation card', (b) => b.bonusCardName(this.name).number(taken));
    } else {
      marsBot.maybeAdvanceTrack(4);
      marsBot.game.log('MarsBot (${0}): advance energy track', (b) => b.bonusCardName(this.name));
    }
    return false;
  }
}
