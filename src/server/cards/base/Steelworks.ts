import {IProjectCard} from '@/server/cards/IProjectCard';
import {Tag} from '@/common/cards/Tag';
import {ActionCard} from '@/server/cards/ActionCard';
import {CardType} from '@/common/cards/CardType';
import {CardName} from '@/common/cards/CardName';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {digit} from '@/server/cards/Options';

export class Steelworks extends ActionCard implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.STEELWORKS,
      tags: [Tag.BUILDING],
      cost: 15,

      action: {
        spend: {energy: 4},
        stock: {steel: 2},
        global: {oxygen: 1},
      },

      metadata: {
        cardNumber: '103',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 4 energy to gain 2 steel and increase oxygen 1 step.', (eb) => {
            eb.energy(4, {digit}).startAction.steel(2).oxygen(1);
          });
        }),
      },
    });
  }
}
