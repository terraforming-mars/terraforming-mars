import {BonusCardId} from '@/common/automa/AutomaTypes';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {createBonusCard} from '@/server/automa/MarsBotBonusCard';
import {MarsBotBonusCardEffect} from '@/server/automa/bonusCards/MarsBotBonusCardEffect';
import {maybePlaceGreenery} from '@/server/automa/bonusCards/bonusCardHelpers';

export class RapidSproutingMarsBot extends MarsBotBonusCardEffect {
  constructor() {
    super({id: BonusCardId.B23_RAPID_SPROUTING});
  }

  public override resolve(marsBot: IMarsBot): boolean {
    const name = createBonusCard(this.id).name;
    if (marsBot.getCorpState('plantResources') > 0) {
      // The plant is spent even when no greenery space is left
      marsBot.setCorpState('plantResources', 0);
      if (maybePlaceGreenery(marsBot)) {
        marsBot.game.log('MarsBot (${0}): places a greenery', (b) => b.cardName(name));
      } else {
        marsBot.game.log('MarsBot (${0}): no greenery space, plant spent', (b) => b.cardName(name));
      }
    } else {
      marsBot.setCorpState('plantResources', 1);
      marsBot.game.log('MarsBot (${0}): 1 plant on the corporation card', (b) => b.cardName(name));
    }
    return false;
  }
}
