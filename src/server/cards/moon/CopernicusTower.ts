import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {Resource} from '../../../common/Resource';
import {CardResource} from '../../../common/CardResource';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {ActionCard} from '../ActionCard';

export class CopernicusTower extends ActionCard {
  constructor() {
    super({
      name: CardName.COPERNICUS_TOWER,
      type: CardType.ACTIVE,
      tags: [Tag.SCIENCE, Tag.MOON],
      cost: 36,

      resourceType: CardResource.SCIENCE,
      requirements: {production: Resource.TITANIUM, count: 2},
      victoryPoints: {tag: Tag.MOON},

      action: {
        or: {
          autoSelect: true,
          behaviors: [
            {
              spend: {resourcesHere: 1},
              tr: 1,
              title: 'Remove 1 science resource to increase TR 1 step',
            },
            {
              addResources: 1,
              title: 'Add 1 science resource to this card',
            },
          ],
        },
      },

      metadata: {
        cardNumber: 'M72',
        renderData: CardRenderer.builder((b) => {
          b.text('Requires you have 2 titanium production.', Size.TINY, false, false).br;
          b.action('Add 1 science resource here, or spend 1 science resource here to raise your TR 1 step.', (eb) => {
            eb.empty().startAction.resource(CardResource.SCIENCE).nbsp.slash().nbsp.resource(CardResource.SCIENCE).arrow().tr(1);
          });
          b.br;
          b.vpText('1 VP PER MOON TAG YOU HAVE.');
        }),
      },
    });
  }
}
