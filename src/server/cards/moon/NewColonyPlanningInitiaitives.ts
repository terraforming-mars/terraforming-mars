import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../requirements/CardRequirements';
import {Card} from '../Card';
import {IProjectCard} from '../IProjectCard';

export class NewColonyPlanningInitiaitives extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.NEW_COLONY_PLANNING_INITIAITIVES,
      type: CardType.AUTOMATED,
      cost: 6,

      behavior: {
        moon: {habitatRate: 1},
      },

      requirements: CardRequirements.builder((b) => b.habitatRate(2)),
      metadata: {
        description: 'Requires the habitat rate to be 2 or higher. Raise the habitat rate 1 step.',
        cardNumber: 'M31',
        renderData: CardRenderer.builder((b) => {
          b.moonHabitatRate();
        }),
      },
    });
  }
}
