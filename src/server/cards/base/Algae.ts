import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class Algae extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.ALGAE,
      tags: [Tag.PLANT],
      cost: 10,

      behavior: {
        production: {plants: 2},
        stock: {plants: 1},
      },

      requirements: CardRequirements.builder((b) => b.oceans(5)),
      metadata: {
        description: 'Requires 5 ocean tiles. Gain 1 plant and increase your plant production 2 steps.',
        cardNumber: '047',
        renderData: CardRenderer.builder((b) => b.production((pb) => pb.plants(2)).plants(1)),
      },
    });
  }
}
