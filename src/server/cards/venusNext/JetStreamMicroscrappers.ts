import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {ActionCard} from '../ActionCard';

export class JetStreamMicroscrappers extends ActionCard {
  constructor() {
    super({
      name: CardName.JET_STREAM_MICROSCRAPPERS,
      type: CardType.ACTIVE,
      tags: [Tag.VENUS],
      cost: 12,
      resourceType: CardResource.FLOATER,

      action: {
        or: {
          autoSelect: true,
          behaviors: [
            {
              spend: {resourcesHere: 2},
              global: {venus: 1},
              title: 'Remove 2 floaters to raise Venus 1 step',
            },
            {
              spend: {titanium: 1},
              addResources: 2,
              title: 'Spend 1 titanium to add 2 floaters to this card',
            },
          ],
        },
      },

      metadata: {
        cardNumber: '234',
        renderData: CardRenderer.builder((b) => {
          b.titanium(1).arrow().resource(CardResource.FLOATER, 2).nbsp.or().br;
          b.resource(CardResource.FLOATER, 2).arrow().venus(1).br;

          b.plainText('Action: Spend 1 titanium to add 2 floaters here, or spend 2 floaters here to raise Venus 1 step.', /* parens */ true);
        }),
      },
    });
  }
}
