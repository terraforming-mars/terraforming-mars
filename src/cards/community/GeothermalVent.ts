import {Player} from '../../Player';
import {PreludeCard} from '../prelude/PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../CardName';
import {Resources} from '../../Resources';
import {Game} from '../../Game';

export class GeothermalVent extends PreludeCard implements IProjectCard {
    public tags = [];
    public name = CardName.GEOTHERMAL_VENT;

    public play(player: Player, game: Game) {
      player.addProduction(Resources.HEAT, 2);
      game.increaseTemperature(player, 2);
      return undefined;
    }
}

