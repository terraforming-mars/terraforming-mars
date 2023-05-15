import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {CardRequirements} from '../requirements/CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {ActionCard} from '../ActionCard';

export class GHGProducingBacteria extends ActionCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.GHG_PRODUCING_BACTERIA,
      tags: [Tag.SCIENCE, Tag.MICROBE],
      cost: 8,
      resourceType: CardResource.MICROBE,

      requirements: CardRequirements.builder((b) => b.oxygen(4)),

      action: {
        or: {
          autoSelect: true,
          behaviors: [
            {
              spend: {resourcesHere: 2},
              global: {temperature: 1},
              title: 'Remove 2 microbes to raise temperature 1 step',
              // LogHelper.logRemoveResource(player, this, 2, 'raise temperature 1 step');
            },
            {
              addResources: 1,
              title: 'Add 1 microbe to this card',
            },
          ],
        },
      },

      metadata: {
        description: 'Requires 4% oxygen.',
        cardNumber: '034',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 microbe to this card.', (eb) => {
            eb.empty().startAction.microbes(1);
          }).br;
          b.or().br;
          b.action('Remove 2 microbes to raise temperature 1 step.', (eb) => {
            eb.microbes(2).startAction.temperature(1);
          });
        }),
      },
    });
  }
}
