import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';

export class InterstellarColonyShip extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.INTERSTELLAR_COLONY_SHIP,
      tags: [Tag.EARTH, Tag.SPACE],
      cost: 24,
      victoryPoints: 4,

      requirements: CardRequirements.builder((b) => b.tag(Tag.SCIENCE, 5)),
      metadata: {
        description: 'Requires that you have 5 science tags.',
        cardNumber: '027',
      },
    });
  }
}
