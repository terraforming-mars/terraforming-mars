import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Tag} from '../../../common/cards/Tag';

export class PrivateResorts extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.PRIVATE_RESORTS,
      type: CardType.AUTOMATED,
      cost: 9,
      tags: [Tag.BUILDING],

      requirements: {oceans: 3},

      behavior: {
        production: {heat: -1, megacredits: 3},
        underworld: {corruption: 1},
      },

      metadata: {
        cardNumber: 'U054',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.minus().heat(1).megacredits(3)).br;
          b.corruption(1);
        }),
        description: 'Requires 3 oceans. Reduce your heat production 1 step. ' +
          'Increase your M€ production 3 steps. Gain 1 corruption.',
      },
    });
  }
}
