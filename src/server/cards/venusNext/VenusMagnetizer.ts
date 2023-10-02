import {IActionCard} from '../ICard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {ActionCard} from '../ActionCard';

export class VenusMagnetizer extends ActionCard implements IActionCard {
  constructor() {
    super({
      name: CardName.VENUS_MAGNETIZER,
      type: CardType.ACTIVE,
      tags: [Tag.VENUS],
      cost: 7,

      action: {
        production: {energy: -1},
        global: {venus: 1},
      },

      requirements: {venus: 10},
      metadata: {
        cardNumber: '256',
        renderData: CardRenderer.builder((b) => {
          b.action('Decrease your energy production 1 step to raise Venus 1 step.', (eb) => {
            eb.production((pb) => pb.energy(1)).startAction.venus(1);
          });
        }),
        description: 'Requires Venus 10%.',
      },
    });
  }
}
