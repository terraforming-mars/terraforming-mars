import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';

export class BreathingFilters extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.BREATHING_FILTERS,
      tags: [Tag.SCIENCE],
      cost: 11,
      victoryPoints: 2,

      requirements: {oxygen: 7},
      metadata: {
        description: 'Requires 7% oxygen.',
        cardNumber: '114',
      },
    });
  }
}
