import {IProjectCard} from '@/server/cards/IProjectCard';
import {Tag} from '@/common/cards/Tag';
import {CardType} from '@/common/cards/CardType';
import {CardName} from '@/common/cards/CardName';
import {Card} from '@/server/cards/Card';
import {CardRenderer} from '@/server/cards/render/CardRenderer';

export class InterplanetaryColonyShip extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 12,
      tags: [Tag.SPACE, Tag.EARTH],
      name: CardName.INTERPLANETARY_COLONY_SHIP,
      type: CardType.EVENT,

      behavior: {
        colonies: {buildColony: {}},
      },

      metadata: {
        cardNumber: 'C17',
        renderData: CardRenderer.builder((b) => b.colonies(1)),
        description: 'Place a colony.',
      },
    });
  }
}
