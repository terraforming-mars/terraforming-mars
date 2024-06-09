import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {ActionCard} from '../ActionCard';

export class NitriteReducingBacteria extends ActionCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.NITRITE_REDUCING_BACTERIA,
      tags: [Tag.MICROBE],
      cost: 11,
      resourceType: CardResource.MICROBE,

      behavior: {
        addResources: 3,
      },

      action: {
        or: {
          autoSelect: true,
          behaviors: [
            {
              spend: {resourcesHere: 3},
              tr: 1,
              title: 'Remove 3 microbes to increase your terraform rating 1 step',
              // LogHelper.logRemoveResource(player, this, 3, 'gain 1 TR');
            },
            {
              addResources: 1,
              title: 'Add 1 microbe to this card',
            },
          ],
        },
      },

      metadata: {
        cardNumber: '157',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 microbe to this card.', (eb) => {
            eb.empty().startAction.resource(CardResource.MICROBE);
          }).br;
          b.or().br;
          b.action('Remove 3 microbes to increase your TR 1 step.', (eb) => {
            eb.resource(CardResource.MICROBE, 3).startAction.tr(1);
          }).br;
          b.resource(CardResource.MICROBE, 3);
        }),
        description: 'Add 3 microbes to this card.',
      },
    });
  }
}
