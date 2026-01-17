import {IProjectCard} from '@/server/cards/IProjectCard';
import {Tag} from '@/common/cards/Tag';
import {Card} from '@/server/cards/Card';
import {CardType} from '@/common/cards/CardType';
import {CardName} from '@/common/cards/CardName';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {digit} from '@/server/cards/Options';

export class GHGFactories extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.GHG_FACTORIES,
      tags: [Tag.BUILDING],
      cost: 11,

      behavior: {
        production: {energy: -1, heat: 4},
      },

      metadata: {
        cardNumber: '126',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(1).br;
            pb.plus().heat(4, {digit});
          });
        }),
        description: 'Decrease your energy production 1 step and increase your heat production 4 steps.',
      },
    });
  }
}
