import {CardName} from '@/common/cards/CardName';
import {CardType} from '@/common/cards/CardType';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {ActionCard} from '@/server/cards/ActionCard';
import {digit} from '@/server/cards/Options';

export class DirectedHeatUsage extends ActionCard {
  constructor() {
    super({
      name: CardName.DIRECTED_HEAT_USAGE,
      type: CardType.ACTIVE,
      cost: 1,

      action: {
        or: {
          behaviors: [
            {
              title: 'Spend 3 heat to gain 4 M€',
              spend: {heat: 3},
              stock: {megacredits: 4},
            },
            {
              title: 'Spend 3 heat to gain 2 plants',
              spend: {heat: 3},
              stock: {plants: 2},
            },
          ],
        },
      },

      metadata: {
        cardNumber: 'X48',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 3 heat to gain either 4 M€ or 2 plants.', (eb) =>
            eb.empty().heat(3, {digit}).startAction.megacredits(4).or().plants(2));
        }),
      },
    });
  }
}
