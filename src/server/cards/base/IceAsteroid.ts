import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class IceAsteroid extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.ICE_ASTEROID,
      tags: [Tag.SPACE],
      cost: 23,

      behavior: {
        ocean: {count: 2},
      },

      metadata: {
        cardNumber: '078',
        renderData: CardRenderer.builder((b) => b.oceans(2)),
        description: 'Place 2 ocean tiles.',
      },
    });
  }
}
