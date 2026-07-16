import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
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
          b.action('Add 1 floater to this card.', (eb) => {
            eb.empty().startAction.resource(CardResource.FLOATER);
          }).br;
          b.or(Size.SMALL).br;
          b.action('Spend 1 floater here to increase your energy production 1 step.', (be) => {
            be.resource(CardResource.FLOATER).startAction.production((pb) => pb.energy(1));
          });
        }),
      },
    });
  }
}
