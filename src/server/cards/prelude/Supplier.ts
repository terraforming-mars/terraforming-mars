import {Tag} from '../../../common/cards/Tag';
import {Player} from '../../Player';
import {PreludeCard2} from './PreludeCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class Supplier extends PreludeCard2 {
  constructor() {
    super({
      name: CardName.SUPPLIER,
      tags: [Tag.ENERGY],
      productionBox: {energy: 2},

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

  public override bespokePlay(player: Player) {
    player.steel +=4;
    return undefined;
  }
}
