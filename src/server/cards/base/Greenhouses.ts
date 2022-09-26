import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {all} from '../Options';

export class Greenhouses extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.GREENHOUSES,
      tags: [Tag.PLANT, Tag.BUILDING],
      cost: 6,

      behavior: {
        stock: {plants: {cities: {}}},
      },

      metadata: {
        cardNumber: '096',
        renderData: CardRenderer.builder((b) => {
          b.plants(1).slash().city({size: Size.SMALL, all});
        }),
        description: 'Gain 1 plant for each city tile in play.',
      },
    });
  }
}
