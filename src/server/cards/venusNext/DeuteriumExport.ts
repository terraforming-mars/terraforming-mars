import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {ActionCard} from '../ActionCard';

export class DeuteriumExport extends ActionCard {
  constructor() {
    super({
      name: CardName.DEUTERIUM_EXPORT,
      type: CardType.ACTIVE,
      tags: [Tag.SPACE, Tag.VENUS, Tag.POWER],
      cost: 11,
      resourceType: CardResource.FLOATER,

      action: {
        or: {
          autoSelect: true,
          behaviors: [{
            title: 'Remove 1 floater to raise energy production 1 step',
            spend: {resourcesHere: 1},
            production: {energy: 1},
          },
          {
            title: 'Add 1 floater to this card',
            addResources: 1,
          }],
        },
      },

      metadata: {
        cardNumber: '221',
        renderData: CardRenderer.builder((b) => {
          b.arrow().resource(CardResource.FLOATER).nbsp.or().br;
          b.resource(CardResource.FLOATER).arrow().production((pb) => pb.energy(1)).br;

          b.plainText('Action: Add 1 floater to this card, or spend 1 floater here to increase your energy production 1 step.', /* parens */ true);
        }),
      },
    });
  }
}
