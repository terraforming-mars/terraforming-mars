import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';
import {Card} from '../Card';
import {IProjectCard} from '../IProjectCard';

export class NewColonyPlanningInitiaitives extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.NEW_COLONY_PLANNING_INITIAITIVES,
      cardType: CardType.AUTOMATED,
      cost: 6,

      behavior: {
        moon: {colonyRate: 1},
      },

      requirements: CardRequirements.builder((b) => b.colonyRate(2)),
      metadata: {
        description: 'Requires Colony Rate to be 2 or higher. Raise the Colony Rate 1 step.',
        cardNumber: 'M31',
        renderData: CardRenderer.builder((b) => {
          b.moonColonyRate();
        }),
      },
    });
  }
}
