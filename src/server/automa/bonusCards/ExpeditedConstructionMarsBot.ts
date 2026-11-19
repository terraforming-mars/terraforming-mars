import {BonusCardId} from '@/common/automa/AutomaTypes';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {createBonusCard} from '@/server/automa/MarsBotBonusCard';
import {MarsBotBonusCardEffect} from '@/server/automa/bonusCards/MarsBotBonusCardEffect';
import {MarsBotTilePlacer} from '@/server/automa/MarsBotTilePlacer';

export class ExpeditedConstructionMarsBot extends MarsBotBonusCardEffect {
  constructor() {
    super({id: BonusCardId.B05_EXPEDITED_CONSTRUCTION});
  }

  public override resolve(marsBot: IMarsBot): boolean {
    const tilePlacer = new MarsBotTilePlacer(marsBot);
    const space = tilePlacer.findExpeditedConstructionCitySpace();
    if (space !== undefined) {
      marsBot.game.addCity(marsBot.player, space);
      marsBot.gainMc(tilePlacer.getTotalPlacementMC(space));
      marsBot.game.log('MarsBot (${0}): places a city, card destroyed', (b) => b.cardName(createBonusCard(this.id).name));
      return true;
    }
    // No failed action if can't place
    return false;
  }
}
