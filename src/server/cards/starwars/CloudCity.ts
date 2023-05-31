import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../requirements/CardRequirements';
import {CardResource} from '../../../common/CardResource';

export class CloudCity extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.CLOUD_CITY,
      tags: [Tag.POWER, Tag.PLANT],
      cost: 5,
      requirements: CardRequirements.builder((b) => b.venus(6)),

      behavior: {
        global: {venus: 1},
        addResourcesToAnyCard: {count: 2, type: CardResource.FLOATER},
      },

      metadata: {
        cardNumber: 'SW05',
        renderData: CardRenderer.builder((b) => b.venus(1).floaters(2)),
        description: 'Requires Venus 6%. Raise Venus 1 step. Add 2 floaters to any card.',
      },
    });
  }
}
