import {IProjectCard} from '@/server/cards/IProjectCard';
import {Card} from '@/server/cards/Card';
import {CardType} from '@/common/cards/CardType';
import {CardName} from '@/common/cards/CardName';
import {CardRenderer} from '@/server/cards/render/CardRenderer';

export class MicroMills extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.MICRO_MILLS,
      cost: 3,

      behavior: {
        production: {heat: 1},
      },

      metadata: {
        cardNumber: '164',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.heat(1));
        }),
        description: 'Increase your heat production 1 step.',
      },
    });
  }
}
