import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {CardName} from '../../CardName';
import {CardRequirements} from '../CardRequirements';

export class BreathingFilters extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.BREATHING_FILTERS,
      tags: [Tags.SCIENCE],
      cost: 11,

      requirements: CardRequirements.builder((b) => b.oxygen(7)),
      metadata: {
        description: 'Requires 7% oxygen.',
        cardNumber: '114',
        victoryPoints: 2,
      },
    });
  }
  public play() {
    return undefined;
  }
  public getVictoryPoints() {
    return 2;
  }
}
