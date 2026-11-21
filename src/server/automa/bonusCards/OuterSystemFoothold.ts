import {BonusCardId} from '@/common/automa/AutomaTypes';
import {CardName} from '@/common/cards/CardName';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotBonusCard} from '@/server/automa/MarsBotBonusCard';

export class OuterSystemFoothold extends MarsBotBonusCard {
  constructor() {
    super({id: BonusCardId.B18_OUTER_SYSTEM_FOOTHOLD, name: CardName.AUTOMA_OUTER_SYSTEM_FOOTHOLD});
  }

  public override resolve(marsBot: IMarsBot): boolean {
    // A colony on a random eligible tile
    if (marsBot.maybePlaceRandomColony()) {
      marsBot.game.log('MarsBot (${0}): places a colony', (b) => b.cardName(this.name));
    } else {
      marsBot.game.log('MarsBot (${0}): no colony tile has room', (b) => b.cardName(this.name));
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
      marsBot.game.log('MarsBot (${0}): draws and discards ${1}', (b) => b.cardName(this.name).cardName(drawn.name));
    }
    return false;
  }
}
