import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {Game} from '../../Game';

export class NitrogenDelivery extends PreludeCard implements IProjectCard {
    public tags = [];
    public name = CardName.NITROGEN_SHIPMENT;

    public play(player: Player, game: Game) {
      player.megaCredits += 5;
      player.increaseTerraformRating(game);
      player.addProduction(Resources.PLANTS);
      return undefined;
    }
}
