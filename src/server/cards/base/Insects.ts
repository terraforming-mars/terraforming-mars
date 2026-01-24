import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class Insects extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.INSECTS,
      tags: [Tag.MICROBE],
      cost: 9,

      behavior: {
        production: {plants: {tag: Tag.PLANT}},
      },

      requirements: {oxygen: 6},
      metadata: {
        cardNumber: '148',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.plants(1).slash().tag(Tag.PLANT));
        }),
        description: 'Requires 6% oxygen. Increase your plant production 1 step for each plant tag you have.',
      },
    });
  }
}
