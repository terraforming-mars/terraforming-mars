import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';

export class AdvancedEcosystems extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.ADVANCED_ECOSYSTEMS,
      tags: [Tag.PLANT, Tag.MICROBE, Tag.ANIMAL],
      cost: 11,
      victoryPoints: 3,

      requirements: [{tag: Tag.PLANT}, {tag: Tag.ANIMAL}, {tag: Tag.MICROBE}],
      metadata: {
        description: 'Requires a plant tag, a microbe tag, and an animal tag.',
        cardNumber: '135',
      },
    });
  }
}
