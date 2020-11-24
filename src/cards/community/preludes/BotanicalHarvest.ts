import {Player} from '../../../Player';
import {PreludeCard} from '../../prelude/PreludeCard';
import {IProjectCard} from '../../IProjectCard';
import {CardName} from '../../../CardName';
import {Game} from '../../../Game';
import {Tags} from '../../Tags';
import {Resources} from '../../../Resources';

export class BotanicalHarvest extends PreludeCard implements IProjectCard {
    public tags = [Tags.PLANT];
    public name = CardName.BOTANICAL_HARVEST;

    public play(player: Player, game: Game) {
      game.increaseOxygenLevel(player, 1);
      player.addProduction(Resources.PLANTS);
      player.setResource(Resources.PLANTS, 5);
      return undefined;
    }
}

