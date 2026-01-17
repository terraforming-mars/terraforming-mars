import {IProjectCard} from '@/server/cards/IProjectCard';
import {Tag} from '@/common/cards/Tag';
import {Card} from '@/server/cards/Card';
import {CardType} from '@/common/cards/CardType';
import {CardName} from '@/common/cards/CardName';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {Size} from '@/common/cards/render/Size';
import {all} from '@/server/cards/Options';

export class Greenhouses extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
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
