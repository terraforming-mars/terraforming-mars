import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class Lichen extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.LICHEN,
      tags: [Tag.PLANT],
      cost: 7,

      behavior: {
        production: {plants: 1},
      },

      requirements: CardRequirements.builder((b) => b.temperature(-24)),
      metadata: {
        cardNumber: '159',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.plants(1));
        }),
        description: 'Requires -24 C or warmer. Increase your plant production 1 step.',
      },
    });
  }
}
