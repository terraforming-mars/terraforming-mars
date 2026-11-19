import {BonusCardId} from '@/common/automa/AutomaTypes';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {createBonusCard} from '@/server/automa/MarsBotBonusCard';
import {MarsBotBonusCardEffect} from '@/server/automa/bonusCards/MarsBotBonusCardEffect';
import {maybeAdvanceTrack} from '@/server/automa/bonusCards/bonusCardHelpers';

export class SupplyAndDemandMarsBot extends MarsBotBonusCardEffect {
  constructor() {
    super({id: BonusCardId.B24_SUPPLY_AND_DEMAND});
  }

  public override resolve(marsBot: IMarsBot): boolean {
    const name = createBonusCard(this.id).name;
    const taken = Math.min(3, marsBot.getCorpState('mcOnCard'));
    if (taken > 0) {
      marsBot.setCorpState('mcOnCard', marsBot.getCorpState('mcOnCard') - taken);
      marsBot.gainMc(taken);
      marsBot.game.log('MarsBot (${0}): takes ${1}:r:mc: from the corporation card', (b) => b.cardName(name).number(taken));
    } else {
      maybeAdvanceTrack(marsBot, 4);
      marsBot.game.log('MarsBot (${0}): advance energy track', (b) => b.cardName(name));
    }
    return false;
  }
}
