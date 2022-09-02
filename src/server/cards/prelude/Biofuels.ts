import {Tag} from '../../../common/cards/Tag';
import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {Resources} from '../../../common/Resources';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class Biofuels extends PreludeCard {
  constructor() {
    super({
      name: CardName.BIOFUELS,
      tags: [Tag.MICROBE],

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
    player.production.add(Resources.ENERGY, 1);
    player.production.add(Resources.PLANTS, 1);
    player.plants += 2;
    return undefined;
  }
}

