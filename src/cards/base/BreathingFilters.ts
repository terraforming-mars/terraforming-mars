import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {CardName} from '../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';

export class BreathingFilters extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.BREATHING_FILTERS,
      tags: [Tags.SCIENCE],
      cost: 11,
      victoryPoints: 2,

      requirements: CardRequirements.builder((b) => b.oxygen(7)),
      metadata: {
        description: 'Requires 7% oxygen.',
        cardNumber: '114',
      },
    });
  }
  public play() {
    return undefined;
  }
}
