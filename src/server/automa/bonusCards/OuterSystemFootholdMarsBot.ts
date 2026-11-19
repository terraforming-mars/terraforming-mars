import {BonusCardId} from '@/common/automa/AutomaTypes';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {createBonusCard} from '@/server/automa/MarsBotBonusCard';
import {MarsBotBonusCardEffect} from '@/server/automa/bonusCards/MarsBotBonusCardEffect';

export class OuterSystemFootholdMarsBot extends MarsBotBonusCardEffect {
  constructor() {
    super({id: BonusCardId.B18_OUTER_SYSTEM_FOOTHOLD});
  }

  public override resolve(marsBot: IMarsBot): boolean {
    const name = createBonusCard(this.id).name;
    // A colony on a random eligible tile
    if (marsBot.maybePlaceRandomColony()) {
      marsBot.game.log('MarsBot (${0}): places a colony', (b) => b.cardName(name));
    } else {
      marsBot.game.log('MarsBot (${0}): no colony tile has room', (b) => b.cardName(name));
    }

    // Then MarsBot draws a bonus card and discards it without resolving it. This card sits out of
    // the discard pile meanwhile, so an empty draw pile doesn't reshuffle it back in.
    const bonusDeck = marsBot.bonusDeck;
    const index = bonusDeck.discardPile.findIndex((c) => c.id === this.id);
    const self = index >= 0 ? bonusDeck.discardPile.splice(index, 1) : [];
    const drawn = bonusDeck.draw(marsBot.game);
    bonusDeck.discardPile.push(...self);
    if (drawn !== undefined) {
      bonusDeck.discard(drawn);
      marsBot.game.log('MarsBot (${0}): draws and discards ${1}', (b) => b.cardName(name).cardName(drawn.name));
    }
    return false;
  }
}
