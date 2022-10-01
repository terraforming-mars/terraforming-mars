import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';

export class AdvancedEcosystems extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.ADVANCED_ECOSYSTEMS,
      tags: [Tag.PLANT, Tag.MICROBE, Tag.ANIMAL],
      cost: 11,
      victoryPoints: 3,

      requirements: CardRequirements.builder((b) => b.tag(Tag.PLANT).tag(Tag.ANIMAL).tag(Tag.MICROBE)),
      metadata: {
        description: 'Requires a plant tag, a aicrobe tag, and an animal tag.',
        cardNumber: '135',
      },
    });
  }
}
