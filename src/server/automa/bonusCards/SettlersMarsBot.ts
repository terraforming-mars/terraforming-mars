import {BonusCardId} from '@/common/automa/AutomaTypes';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {createBonusCard} from '@/server/automa/MarsBotBonusCard';
import {MarsBotBonusCardEffect} from '@/server/automa/bonusCards/MarsBotBonusCardEffect';
import {MarsBotTilePlacer} from '@/server/automa/MarsBotTilePlacer';

export class SettlersMarsBot extends MarsBotBonusCardEffect {
  constructor() {
    super({id: BonusCardId.B22_SETTLERS});
  }

  public override resolve(marsBot: IMarsBot): boolean {
    // Arcadian Communities: a player marker, not a tile, on a space that is not reserved
    const space = new MarsBotTilePlacer(marsBot).findMarkerSpace();
    if (space === undefined) {
      marsBot.game.log('MarsBot (${0}): no space left for a player marker', (b) => b.cardName(createBonusCard(this.id).name));
      return false;
    }
    marsBot.placeMarker(space);
    return false;
  }
}
