import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class AdaptedLichen extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.ADAPTED_LICHEN,
      tags: [Tag.PLANT],
      cost: 9,

      behavior: {
        production: {plants: 1},
      },

      metadata: {
        description: 'Increase your plant production 1 step.',
        cardNumber: '048',
        renderData: CardRenderer.builder((b) => b.production((pb) => pb.plants(1))),
      },
    });
  }
}
