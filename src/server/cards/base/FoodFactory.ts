import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class FoodFactory extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.FOOD_FACTORY,
      tags: [Tag.BUILDING],
      cost: 12,

      behavior: {
        production: {megacredits: 4, plants: -1},
      },
      victoryPoints: 1,

      metadata: {
        cardNumber: '041',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().plants(1).br;
            pb.plus().megacredits(4);
          });
        }),
        description: 'Decrease your plant production 1 step and increase your M€ production 4 steps',
      },
    });
  }
}
