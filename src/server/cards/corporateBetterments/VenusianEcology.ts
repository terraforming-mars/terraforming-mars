import {ActionCard} from '../ActionCard';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {IProjectCard} from '../IProjectCard';

export class VenusianEcology extends ActionCard implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.VENUSIAN_ECOLOGY,
      tags: [Tag.VENUS, Tag.PLANT],
      cost: 12,
      victoryPoints: 2,
      requirements: {venus: 12},
      action: {
        spend: {plants: 3},
        global: {venus: 1},
      },
      metadata: {
        cardNumber: 'B51',
        description: 'Requires at least 12% Venus.',
        renderData: CardRenderer.builder((b) => {
          b.action('Pay 3 Plants to raise Venus 1 step.', (ab) => {
            ab.plants(3).startAction.venus(1);
          });
        }),
      },
    });
  }
}
