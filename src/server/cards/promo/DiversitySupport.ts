import {IProjectCard} from '../IProjectCard';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class DiversitySupport extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.DIVERSITY_SUPPORT,
      tags: [],
      cost: 1,

      behavior: {
        tr: 1,
      },

      requirements: {resourceTypes: 9},
      metadata: {
        cardNumber: 'X20',
        description: 'Requires that you have 9 different types of resources. Gain 1 TR.',
        renderData: CardRenderer.builder((b) => b.tr(1)),
      },
    });
  }
}
