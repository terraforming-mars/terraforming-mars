import {Card} from '@/server/cards/Card';
import {CardType} from '@/common/cards/CardType';
import {IProjectCard} from '@/server/cards/IProjectCard';
import {Tag} from '@/common/cards/Tag';
import {CardName} from '@/common/cards/CardName';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {Size} from '@/common/cards/render/Size';

export class InventionContest extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.INVENTION_CONTEST,
      tags: [Tag.SCIENCE],
      cost: 2,

      behavior: {
        drawCard: {count: 3, keep: 1},
      },

      metadata: {
        cardNumber: '192',
        renderData: CardRenderer.builder((b) => {
          b.text('Look at the top 3 cards from the deck. Take 1 of them into hand and discard the other two', Size.SMALL, true);
        }),
      },
    });
  }
}
