import {Tag} from '../../../common/cards/Tag';
import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {Resources} from '../../../common/Resources';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class Supplier extends PreludeCard {
  constructor() {
    super({
      name: CardName.SUPPLIER,
      tags: [Tag.ENERGY],

      metadata: {
        cardNumber: 'P32',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.energy(2)).br;
          b.steel(4);
        }),
        description: 'Increase your energy production 2 steps. Gain 4 steel.',
      },
    });
  }

  public play(player: Player) {
    player.production.add(Resources.ENERGY, 2);
    player.steel +=4;
    return undefined;
  }
}
