import {IProjectCard} from '@/server/cards/IProjectCard';
import {Tag} from '@/common/cards/Tag';
import {Card} from '@/server/cards/Card';
import {CardType} from '@/common/cards/CardType';
import {CardName} from '@/common/cards/CardName';
import {CardRenderer} from '@/server/cards/render/CardRenderer';

export class Sponsors extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.SPONSORS,
      tags: [Tag.EARTH],
      cost: 6,

      behavior: {
        production: {megacredits: 2},
      },

      metadata: {
        cardNumber: '068',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(2));
        }),
        description: 'Increase your M€ production 2 steps.',
      },
    });
  }
}
