import {BonusCardId} from '@/common/automa/AutomaTypes';
import {CardName} from '@/common/cards/CardName';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotBonusCard} from '@/server/automa/MarsBotBonusCard';
import {MarsBotTilePlacer} from '@/server/automa/MarsBotTilePlacer';

export class Settlers extends MarsBotBonusCard {
  constructor() {
    super({id: BonusCardId.B22_SETTLERS, name: CardName.AUTOMA_SETTLERS});
  }

  public override resolve(marsBot: IMarsBot): boolean {
    // A player marker, not a tile, on a space that is not reserved
    const space = new MarsBotTilePlacer(marsBot).findMarkerSpace();
    if (space === undefined) {
      marsBot.game.log('MarsBot (${0}): no space left for a player marker', (b) => b.cardName(this.name));
      return false;
    }
    marsBot.placeMarker(space);
    return false;
  }
}
