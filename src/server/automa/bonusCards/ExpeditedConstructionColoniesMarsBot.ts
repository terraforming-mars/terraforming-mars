import {BonusCardId} from '@/common/automa/AutomaTypes';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotBonusCardEffect} from '@/server/automa/bonusCards/MarsBotBonusCardEffect';
import {MarsBotTilePlacer} from '@/server/automa/MarsBotTilePlacer';

export class ExpeditedConstructionColoniesMarsBot extends MarsBotBonusCardEffect {
  constructor() {
    super({id: BonusCardId.B17_EXPEDITED_CONSTRUCTION_COLONIES});
  }

  public override resolve(marsBot: IMarsBot): boolean {
    // C-15a: a city next to 2 or more greenery or ocean tiles destroys the card
    const tilePlacer = new MarsBotTilePlacer(marsBot);
    const citySpace = tilePlacer.findExpeditedConstructionCitySpace();
    if (citySpace !== undefined) {
      marsBot.game.addCity(marsBot.player, citySpace);
      marsBot.gainMc(tilePlacer.getTotalPlacementMC(citySpace));
      marsBot.game.log('MarsBot (${0}): places a city, card destroyed', (b) => b.cardName(this.name));
      return true;
    }

    // C-15b: with at most 1 colony, MarsBot places one on a random eligible tile and keeps the card
    const colonyCount = marsBot.game.colonies.filter((c) => c.colonies.includes(marsBot.player.id)).length;
    if (colonyCount <= 1) {
      if (marsBot.maybePlaceRandomColony()) {
        marsBot.game.log('MarsBot (${0}): places a colony', (b) => b.cardName(this.name));
        return false;
      }
    }

    // C-15c: no effect
    marsBot.game.log('MarsBot (${0}): no effect', (b) => b.cardName(this.name));
    return false;
  }
}
