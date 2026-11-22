import {BonusCardName} from '@/common/automa/BonusCardName';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotBonusCard} from '@/server/automa/bonusCards/MarsBotBonusCard';

export class RapidSprouting extends MarsBotBonusCard {
  constructor() {
    super(BonusCardName.RAPID_SPROUTING);
  }

  public override resolve(marsBot: IMarsBot): boolean {
    if (marsBot.getCorpState('plantResources') > 0) {
      // The plant is spent even when no greenery space is left
      marsBot.setCorpState('plantResources', 0);
      if (marsBot.maybePlaceGreenery()) {
        marsBot.game.log('MarsBot (${0}): places a greenery', (b) => b.bonusCardName(this.name));
      } else {
        marsBot.game.log('MarsBot (${0}): no greenery space, plant spent', (b) => b.bonusCardName(this.name));
      }
    } else {
      marsBot.setCorpState('plantResources', 1);
      marsBot.game.log('MarsBot (${0}): 1 plant on the corporation card', (b) => b.bonusCardName(this.name));
    }
    return false;
  }
}
