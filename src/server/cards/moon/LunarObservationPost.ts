import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardResource} from '../../../common/CardResource';
import {CardRenderer} from '../render/CardRenderer';
import {ActionCard} from '../ActionCard';

export class LunarObservationPost extends ActionCard {
  constructor() {
    super({
      name: CardName.LUNAR_OBSERVATION_POST,
      type: CardType.ACTIVE,
      tags: [Tag.SCIENCE, Tag.SCIENCE],
      cost: 7,

      resourceType: CardResource.DATA,
      victoryPoints: {resourcesHere: {}, per: 3},
      reserveUnits: {titanium: 1},

      action: {
        addResourcesToAnyCard: {type: CardResource.DATA, count: 1},
      },

      metadata: {
        description: 'Spend 1 titanium. 1 VP for every 3 data resources here.',
        cardNumber: 'M22',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 data resource to ANY card', (ab) => {
            ab.empty().startAction.resource(CardResource.DATA).asterix();
          });
          b.br;
          b.minus().titanium(1);
        }),
      },
    });
  }
}
