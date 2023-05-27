import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';

export class TokamakFundraiser extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.TOKAMAK_FUNDRAISER,
      tags: [Tag.SCIENCE, Tag.SPACE],
      cost: 5,

      behavior: {
        drawCard: {count: 3, keep: 2},
      },

      metadata: {
        cardNumber: 'N38',
        renderData: CardRenderer.builder((b) => {
          b.text('Look at the top 3 cards from the deck. Add 2 to your hand and discard the other.', Size.SMALL, true);
        }),
      },
    });
  }
}
