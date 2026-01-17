import {Tag} from '@/common/cards/Tag';
import {CardType} from '@/common/cards/CardType';
import {CardName} from '@/common/cards/CardName';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {digit} from '@/server/cards/Options';
import {ActionCard} from '@/server/cards/ActionCard';

export class Meltworks extends ActionCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.MELTWORKS,
      tags: [Tag.BUILDING],
      cost: 4,

      action: {
        spend: {heat: 5},
        stock: {steel: 3},
      },

      metadata: {
        cardNumber: 'X26',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 5 heat to gain 3 steel.', (eb) => {
            eb.heat(5, {digit}).startAction.steel(3);
          });
        }),
      },
    });
  }
}
