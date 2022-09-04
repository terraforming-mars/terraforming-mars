import {Tag} from '../../../common/cards/Tag';
import {PreludeCard} from './PreludeCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class Supplier extends PreludeCard {
  constructor() {
    super({
      name: CardName.SUPPLIER,
      tags: [Tag.ENERGY],

      behavior: {
        production: {energy: 2},
        stock: {steel: 4},
      },

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
}
