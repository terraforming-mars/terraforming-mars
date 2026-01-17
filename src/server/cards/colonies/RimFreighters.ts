import {IProjectCard} from '@/server/cards/IProjectCard';
import {Tag} from '@/common/cards/Tag';
import {CardType} from '@/common/cards/CardType';
import {CardName} from '@/common/cards/CardName';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {Card} from '@/server/cards/Card';

export class RimFreighters extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 4,
      tags: [Tag.SPACE],
      name: CardName.RIM_FREIGHTERS,
      type: CardType.ACTIVE,

      behavior: {
        colonies: {tradeDiscount: 1},
      },

      metadata: {
        cardNumber: 'C35',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you trade, you pay 1 less resource for it.', (eb) => {
            eb.trade().startEffect.tradeDiscount(1);
          });
        }),
      },
    });
  }
}
