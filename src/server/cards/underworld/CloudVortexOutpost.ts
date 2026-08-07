import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {ActivePreludeCard} from '../prelude2/ActivePreludeCard';
import {CardResource} from '../../../common/CardResource';
import {digit} from '../Options';

export class CloudVortexOutpost extends ActivePreludeCard {
  constructor() {
    super({
      name: CardName.CLOUD_VORTEX_OUTPOST,
      tags: [Tag.VENUS],
      resourceType: CardResource.FLOATER,

      behavior: {
        global: {venus: 2},
        addResources: 3,
      },

      action: {
        spend: {resourcesHere: 1},
        addResourcesToAnyCard: {
          count: 1,
          type: CardResource.FLOATER,
          excludeThis: true,
          mustHaveCard: true,
        },
      },

      metadata: {
        cardNumber: 'UP15',
        renderData: CardRenderer.builder((b) => {
          b.venus(2, {digit}).resource(CardResource.FLOATER, {amount: 3, digit}).br;
          b.plainText('Raise Venus 2 steps. Place 3 floaters on this card.').br;
          b.action('Remove 1 floater from THIS card to add 1 floater to ANOTHER card', (ab) => {
            ab.resource(CardResource.FLOATER).asterix().startAction.resource(CardResource.FLOATER).asterix();
          });
        }),
      },
    });
  }
}
