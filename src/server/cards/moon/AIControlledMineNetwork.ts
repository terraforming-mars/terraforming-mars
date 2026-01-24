import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {IProjectCard} from '../IProjectCard';

export class AIControlledMineNetwork extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.AI_CONTROLLED_MINE_NETWORK,
      type: CardType.AUTOMATED,
      tags: [Tag.SCIENCE],
      cost: 6,

      behavior: {
        moon: {logisticsRate: 1},
      },

      requirements: {logisticRate: 2},
      metadata: {
        description: 'Requires the logistic rate to be 2 or higher. Raise the logistic rate 1 step',
        cardNumber: 'M32',
        renderData: CardRenderer.builder((b) => {
          b.moonLogisticsRate();
        }),
      },
    });
  }
}
