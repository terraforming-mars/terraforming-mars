import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class SocietySupport extends PreludeCard {
    public tags = [];
    public name = CardName.SOCIETY_SUPPORT;
    public play(player: Player) {
      player.addProduction(Resources.MEGACREDITS, -1);
      player.addProduction(Resources.PLANTS);
      player.addProduction(Resources.ENERGY);
      player.addProduction(Resources.HEAT);
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: 'P31',
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => {
          pb.megacredits(-1).plants(1).br;
          pb.energy(1).heat(1);
        });
      }),
      description: 'Increase your plant, energy and heat production 1 step. Decrease money production 1 step.',
    }
}
