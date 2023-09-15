import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class TerraformingContract extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.TERRAFORMING_CONTRACT,
      cost: 8,
      tags: [Tag.EARTH],

      behavior: {
        production: {megacredits: 4},
      },

      requirements: {tr: 25},
      metadata: {
        cardNumber: '252',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(4));
        }),
        description: 'Requires that you have at least 25 TR. Increase your M€ production 4 steps.',
      },
    });
  }
}
