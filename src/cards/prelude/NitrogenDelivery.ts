import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class NitrogenDelivery extends PreludeCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.NITROGEN_SHIPMENT,
      startingMegacredits: 5,


      metadata: {
        cardNumber: 'P24',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.plants(1)).tr(1).br;
          b.megacredits(5);
        }),
        description: 'Increase your plant production 1 step. Increase your TR 1 step. Gain 5 M€.',
      },
    });
  }
  public play(player: Player) {
    player.megaCredits += 5;
    player.increaseTerraformRating();
    player.addProduction(Resources.PLANTS, 1);
    return undefined;
  }
}
