import {Tags} from '../Tags';
import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class Biofuels extends PreludeCard {
    public tags = [Tags.MICROBE];
    public name = CardName.BIOFUELS;
    public play(player: Player) {
      player.addProduction(Resources.ENERGY);
      player.addProduction(Resources.PLANTS);
      player.plants += 2;
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: 'P03',
      renderData: CardRenderer.builder((b) => {
        b.production((pb) => pb.energy(1).plants(1)).br;
        b.plants(2);
      }),
      description: 'Increase your energy and plant production 1 step. Gain 2 plants.',
    }
}

