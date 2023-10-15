import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';

export class InterstellarColonyShip extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.INTERSTELLAR_COLONY_SHIP,
      tags: [Tag.EARTH, Tag.SPACE],
      cost: 24,
      victoryPoints: 4,

      requirements: {tag: Tag.SCIENCE, count: 5},
      metadata: {
        description: 'Requires that you have 5 science tags.',
        cardNumber: '027',
      },
    });
  }
}
