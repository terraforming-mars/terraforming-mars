import {IMarsBot} from '@/server/automa/IMarsBot';
import {BonusCardName} from '@/common/automa/BonusCardName';
import {MarsBotBonusCard} from '@/server/automa/bonusCards/MarsBotBonusCard';
import {MarsBotTilePlacer} from '@/server/automa/MarsBotTilePlacer';

export class ExpeditedConstructionColonies extends MarsBotBonusCard {
  constructor() {
    super(BonusCardName.EXPEDITED_CONSTRUCTION_COLONIES);
  }

  public override resolve(marsBot: IMarsBot): boolean {
    // A city next to 2 or more greenery or ocean tiles destroys the card (rulebook C, p.4)
    const tilePlacer = new MarsBotTilePlacer(marsBot);
    const citySpace = tilePlacer.findExpeditedConstructionCitySpace();
    if (citySpace !== undefined) {
      marsBot.game.addCity(marsBot.player, citySpace);
      marsBot.gainMc(tilePlacer.getTotalPlacementMC(citySpace));
      marsBot.game.log('MarsBot (${0}): places a city, card destroyed', (b) => b.bonusCardName(this.name));
      return true;
    }

    // With at most 1 colony, MarsBot places one on a random eligible tile and keeps the card
    const colonyCount = marsBot.game.colonies.filter((c) => c.colonies.includes(marsBot.player.id)).length;
    if (colonyCount <= 1) {
      if (marsBot.maybePlaceRandomColony()) {
        marsBot.game.log('MarsBot (${0}): places a colony', (b) => b.bonusCardName(this.name));
        return false;
      }
    }

    // Otherwise, no effect
    marsBot.game.log('MarsBot (${0}): no effect', (b) => b.bonusCardName(this.name));
    return false;
  }
}
