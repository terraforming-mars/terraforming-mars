import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {ActionCard} from '../ActionCard';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {digit} from '../Options';

export class OreProcessor extends ActionCard implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.ORE_PROCESSOR,
      tags: [Tag.BUILDING],
      cost: 13,

      action: {
        spend: {energy: 4},
        stock: {titanium: 1},
        global: {oxygen: 1},
      },

      metadata: {
        cardNumber: '104',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 4 energy to gain 1 titanium and increase oxygen 1 step.', (eb) => {
            eb.energy(4, {digit}).startAction.titanium(1).oxygen(1);
          });
        }),
      },
    });
  }
}
