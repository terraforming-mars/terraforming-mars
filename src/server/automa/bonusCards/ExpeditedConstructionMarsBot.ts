import {BonusCardId} from '@/common/automa/AutomaTypes';
import {CardName} from '@/common/cards/CardName';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotBonusCard} from '@/server/automa/MarsBotBonusCard';
import {MarsBotTilePlacer} from '@/server/automa/MarsBotTilePlacer';

export class ExpeditedConstructionMarsBot extends MarsBotBonusCard {
  constructor() {
    super({id: BonusCardId.B05_EXPEDITED_CONSTRUCTION, name: CardName.AUTOMA_EXPEDITED_CONSTRUCTION});
  }

  public override resolve(marsBot: IMarsBot): boolean {
    const tilePlacer = new MarsBotTilePlacer(marsBot);
    const space = tilePlacer.findExpeditedConstructionCitySpace();
    if (space !== undefined) {
      marsBot.game.addCity(marsBot.player, space);
      marsBot.gainMc(tilePlacer.getTotalPlacementMC(space));
      marsBot.game.log('MarsBot (${0}): places a city, card destroyed', (b) => b.cardName(this.name));
      return true;
    }
    // No failed action if can't place
    return false;
  }
}
