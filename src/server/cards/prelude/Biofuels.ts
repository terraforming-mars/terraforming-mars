import {Tag} from '../../../common/cards/Tag';
import {PreludeCard} from './PreludeCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class Biofuels extends PreludeCard {
  constructor() {
    super({
      name: CardName.BIOFUELS,
      tags: [Tag.MICROBE],

      behavior: {
        production: {energy: 1, plants: 1},
        stock: {plants: 2},
      },

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
}

