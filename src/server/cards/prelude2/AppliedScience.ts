import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardResource} from '../../../common/CardResource';
import {IActionCard} from '../ICard';
import {digit} from '../Options';
import {ActivePreludeCard} from './ActivePreludeCard';

export class AppliedScience extends ActivePreludeCard implements IActionCard {
  constructor() {
    super({
      name: CardName.APPLIED_SCIENCE,
      tags: [Tag.WILD],
      resourceType: CardResource.SCIENCE,

      behavior: {
        addResources: 6,
      },

      action: {
        or: {
          behaviors: [
            {
              spend: {resourcesHere: 1},
              standardResource: 1,
              title: 'Spend 1 science resource here to gain 1 standard resource',
            },
            {
              spend: {resourcesHere: 1},
              addResourcesToAnyCard: {
                count: 1,
                min: 1,
                mustHaveCard: true,
                robotCards: true,
              },
              title: 'Spend 1 science resource here to gain 1 resource on ANY CARD WITH A RESOURCE.',
            },
          ],
          autoSelect: true,
        },
      },

      metadata: {
        cardNumber: '',
        renderData: CardRenderer.builder((b) => {
          b.action('Remove 1 resource here to gain 1 standard resource of your choice or add 1 resource on ANY CARD WITH A RESOURCE.', (ab) => {
            ab.resource(CardResource.SCIENCE).startAction.wild(1).asterix();
          }).br;
          b.resource(CardResource.SCIENCE, {amount: 6, digit}).br;
        }),
        description: 'Add 6 resources here.',
      },
    });
  }
}
