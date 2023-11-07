import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Tag} from '../../../common/cards/Tag';

export class OffWorldTaxHaven extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.OFF_WORLD_TAX_HAVEN,
      cost: 8,
      tags: [Tag.EARTH, Tag.SPACE],

      victoryPoints: -1,
      requirements: {corruption: 2},

      behavior: {
        production: {megacredits: 5},
      },

      metadata: {
        cardNumber: 'U10',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(5));
        }),
        description: 'Requires 2 corruption. Increase your M€ production 5 steps.',
      },
    });
  }
}
