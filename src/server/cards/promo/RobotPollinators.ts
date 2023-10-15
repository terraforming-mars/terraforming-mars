import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {played} from '../Options';
import {Tag} from '../../../common/cards/Tag';

export class RobotPollinators extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.ROBOT_POLLINATORS,
      cost: 9,
      requirements: {oxygen: 4},
      behavior: {
        production: {plants: 1},
        stock: {plants: {tag: Tag.PLANT}},
      },

      metadata: {
        cardNumber: 'X45',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.plants(1)).br.plants(1).slash().plants(1, {played});
        }),
        description: 'Requires 4% oxygen. Increase your plant production 1 step. Gain 1 plant for every plant tag you have.',
      },
    });
  }
}
