import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {Resources} from '../../common/Resources';
import {CardName} from '../../common/cards/CardName';
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
    player.addProduction(Resources.PLANTS, 1);
    player.addProduction(Resources.ENERGY, 1);
    player.addProduction(Resources.HEAT, 1);
    return undefined;
  }
}
