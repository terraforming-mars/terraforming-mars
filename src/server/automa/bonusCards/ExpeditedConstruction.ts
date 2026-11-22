import {IMarsBot} from '@/server/automa/IMarsBot';
import {BonusCardName} from '@/common/automa/BonusCardName';
import {MarsBotBonusCard} from '@/server/automa/bonusCards/MarsBotBonusCard';
import {MarsBotTilePlacer} from '@/server/automa/MarsBotTilePlacer';

export class ExpeditedConstruction extends MarsBotBonusCard {
  constructor() {
    super(BonusCardName.EXPEDITED_CONSTRUCTION);
  }

  public override resolve(marsBot: IMarsBot): boolean {
    const tilePlacer = new MarsBotTilePlacer(marsBot);
    const space = tilePlacer.findExpeditedConstructionCitySpace();
    if (space !== undefined) {
      marsBot.game.addCity(marsBot.player, space);
      marsBot.gainMc(tilePlacer.getTotalPlacementMC(space));
      marsBot.game.log('MarsBot (${0}): places a city, card destroyed', (b) => b.bonusCardName(this.name));
      return true;
    }
    // Not a Failed Action when no city fits
    return false;
  }
}
