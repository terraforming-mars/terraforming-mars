import {IProjectCard} from '@/server/cards/IProjectCard';
import {Tag} from '@/common/cards/Tag';
import {ActionCard} from '@/server/cards/ActionCard';
import {CardType} from '@/common/cards/CardType';
import {CardName} from '@/common/cards/CardName';
import {CardRenderer} from '@/server/cards/render/CardRenderer';

export class UndergroundDetonations extends ActionCard implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.UNDERGROUND_DETONATIONS,
      tags: [Tag.BUILDING],
      cost: 6,

      action: {
        spend: {megacredits: 10},
        production: {heat: 2},
      },

      metadata: {
        cardNumber: '202',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 10M€ to increase your heat production 2 steps.', (eb) => {
            eb.megacredits(10).startAction.production((pb)=>pb.heat(2));
          });
        }),
      },
    });
  }
}
