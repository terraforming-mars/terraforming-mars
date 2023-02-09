import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class Bushes extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.BUSHES,
      tags: [Tag.PLANT],
      cost: 10,

      behavior: {
        production: {plants: 2},
        stock: {plants: 2},
      },

      requirements: CardRequirements.builder((b) => b.temperature(-10)),
      metadata: {
        cardNumber: '093',
        description: 'Requires -10 C or warmer. Increase your plant production 2 steps. Gain 2 plants.',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.plants(2);
          }).plants(2);
        }),
      },
    });
  }
}
