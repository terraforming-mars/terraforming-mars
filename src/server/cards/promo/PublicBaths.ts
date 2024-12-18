import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class PublicBaths extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.PUBLIC_BATHS,
      tags: [Tag.BUILDING],
      cost: 6,
      victoryPoints: 1,

      behavior: {
        stock: {megacredits: 6},
      },

      requirements: {oceans: 6},
      metadata: {
        cardNumber: 'X70',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(6);
        }),
        description: 'Requires 6 oceans. Gain 6 M€.',
      },
    });
  }
}
