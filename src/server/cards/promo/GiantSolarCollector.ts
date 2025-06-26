import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {PreludeCard} from '../prelude/PreludeCard';
import {Tag} from '../../../common/cards/Tag';

export class GiantSolarCollector extends PreludeCard {
  constructor() {
    super({
      name: CardName.GIANT_SOLAR_COLLECTOR,
      tags: [Tag.POWER, Tag.SPACE],

      behavior: {
        production: {energy: 2},
        global: {venus: 1},
      },

      metadata: {
        cardNumber: 'X55',
        description: 'Increase your energy production 2 steps. Raise Venus 1 step.',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.energy(2)).venus(1);
        }),
      },
    });
  }
}
