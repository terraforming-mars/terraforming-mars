import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {ActionCard} from '../ActionCard';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {digit} from '../Options';

export class Ironworks extends ActionCard implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.IRONWORKS,
      tags: [Tag.BUILDING],
      cost: 11,

      action: {
        spend: {energy: 4},
        stock: {steel: 1},
        global: {oxygen: 1},
      },

      metadata: {
        cardNumber: '101',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 4 energy to gain 1 steel and raise oxygen 1 step.', (eb) => {
            eb.energy(4, {digit}).startAction.steel(1).oxygen(1);
          });
        }),
      },
    });
  }
}
