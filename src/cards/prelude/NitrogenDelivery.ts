import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {Game} from '../../Game';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class NitrogenDelivery extends PreludeCard implements IProjectCard {
    public tags = [];
    public name = CardName.NITROGEN_SHIPMENT;

    public play(player: Player, game: Game) {
      player.megaCredits += 5;
      player.increaseTerraformRating(game);
      player.addProduction(Resources.PLANTS);
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: 'P24',
      renderData: CardRenderer.builder((b) => {
        b.production((pb) => pb.plants(1)).tr(1).br;
        b.megacredits(5);
      }),
      description: 'Increase your plant production 1 step. Increase your TR 1 step. Gain 5 MC.',
    }
}
