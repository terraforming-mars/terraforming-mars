import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {max} from '../Options';

export class ColonizerTrainingCamp extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.COLONIZER_TRAINING_CAMP,
      tags: [Tag.JOVIAN, Tag.BUILDING],
      cost: 8,
      victoryPoints: 2,

      requirements: {oxygen: 5, max},
      metadata: {
        description: 'Oxygen must be 5% or less.',
        cardNumber: '001',
      },
    });
  }
}
