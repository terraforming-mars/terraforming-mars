import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class Heather extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.HEATHER,
      tags: [Tag.PLANT],
      cost: 6,

      behavior: {
        production: {plants: 1},
        stock: {plants: 1},
      },

      requirements: {temperature: -14},
      metadata: {
        cardNumber: '88',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.plants(1)).plants(1);
        }),
        description: 'Requires -14 C° or warmer. Increase your plant production 1 step. Gain 1 plant.',
      },
    });
  }
}
