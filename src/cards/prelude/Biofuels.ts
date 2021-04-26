import {Tags} from '../Tags';
import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class Biofuels extends PreludeCard {
  constructor() {
    super({
      name: CardName.BIOFUELS,
      tags: [Tags.MICROBE],

      metadata: {
        cardNumber: 'P03',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.energy(1).plants(1)).br;
          b.plants(2);
        }),
        description: 'Increase your energy and plant production 1 step. Gain 2 plants.',
      },
    });
  }
  public play(player: Player) {
    player.addProduction(Resources.ENERGY, 1);
    player.addProduction(Resources.PLANTS, 1);
    player.plants += 2;
    return undefined;
  }
}

