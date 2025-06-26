import {PreludeCard} from '../prelude/PreludeCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';

export class BatteryShipment extends PreludeCard {
  constructor() {
    super({
      name: CardName.BATTERY_SHIPMENT,
      tags: [Tag.POWER],

      behavior: {
        stock: {energy: 12},
        production: {energy: 2},
      },

      metadata: {
        cardNumber: 'UP10',
        renderData: CardRenderer.builder((b) => {
          b.energy(12).production((pb) => pb.energy(2));
        }),
        description: 'Gain 12 energy. Increase your energy production 2 steps.',
      },
    });
  }
}

