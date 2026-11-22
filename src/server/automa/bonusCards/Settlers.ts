import {BonusCardName} from '@/common/automa/BonusCardName';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotBonusCard} from '@/server/automa/bonusCards/MarsBotBonusCard';
import {MarsBotTilePlacer} from '@/server/automa/MarsBotTilePlacer';

export class Settlers extends MarsBotBonusCard {
  constructor() {
    super(BonusCardName.SETTLERS);
  }

  public override resolve(marsBot: IMarsBot): boolean {
    // A player marker, not a tile, on a space that is not reserved
    const space = new MarsBotTilePlacer(marsBot).findMarkerSpace();
    if (space === undefined) {
      marsBot.game.log('MarsBot (${0}): no space left for a player marker', (b) => b.bonusCardName(this.name));
      return false;
    }
    marsBot.placeMarker(space);
    return false;
  }
}
