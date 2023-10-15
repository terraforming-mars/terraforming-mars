import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class Harvest extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.HARVEST,
      tags: [Tag.PLANT],
      cost: 4,
      requirements: {greeneries: 3},

      behavior: {
        stock: {megacredits: 12},
      },

      metadata: {
        cardNumber: 'X37',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(12);
        }),
        description: 'Requires that you have 3 greenery tiles in play. Gain 12 M€.',
      },
    });
  }
}
