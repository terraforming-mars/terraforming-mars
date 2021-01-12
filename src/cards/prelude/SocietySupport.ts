import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class SocietySupport extends PreludeCard {
  constructor() {
    super({
      name: CardName.SOCIETY_SUPPORT,

      metadata: {
        cardNumber: 'P31',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.megacredits(-1).plants(1).br;
            pb.energy(1).heat(1);
          });
        }),
        description: 'Increase your plant, energy and heat production 1 step. Decrease money production 1 step.',
      },
    });
  }
  public play(player: Player) {
    player.addProduction(Resources.MEGACREDITS, -1);
    player.addProduction(Resources.PLANTS);
    player.addProduction(Resources.ENERGY);
    player.addProduction(Resources.HEAT);
    return undefined;
  }
}
