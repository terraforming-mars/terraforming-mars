import {BonusCardName} from '@/common/automa/BonusCardName';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotBonusCard} from '@/server/automa/bonusCards/MarsBotBonusCard';

export class OuterSystemFoothold extends MarsBotBonusCard {
  constructor() {
    super(BonusCardName.OUTER_SYSTEM_FOOTHOLD);
  }

  public override resolve(marsBot: IMarsBot): boolean {
    if (marsBot.maybePlaceRandomColony()) {
      marsBot.game.log('MarsBot (${0}): places a colony', (b) => b.bonusCardName(this.name));
    } else {
      marsBot.game.log('MarsBot (${0}): no colony tile has room', (b) => b.bonusCardName(this.name));
    }

    // Then MarsBot draws a bonus card and discards it without resolving it. This card sits out of
    // the discard pile meanwhile, so an empty draw pile doesn't reshuffle it back in.
    const bonusDeck = marsBot.bonusDeck;
    const index = bonusDeck.discardPile.findIndex((c) => c.name === this.name);
    const self = index >= 0 ? bonusDeck.discardPile.splice(index, 1) : [];
    const drawn = bonusDeck.draw(marsBot.game);
    bonusDeck.discardPile.push(...self);
    if (drawn !== undefined) {
      bonusDeck.discard(drawn);
      marsBot.game.log('MarsBot (${0}): draws and discards ${1}', (b) => b.bonusCardName(this.name).bonusCardName(drawn.name));
    }
    return false;
  }
}
