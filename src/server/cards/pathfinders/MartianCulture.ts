import {IProjectCard} from '../IProjectCard';
import {ActionCard} from '../ActionCard';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {CardResource} from '../../../common/CardResource';
import {all} from '../Options';

export class MartianCulture extends ActionCard implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.MARTIAN_CULTURE,
      cost: 11,
      tags: [Tag.MARS, Tag.MARS],
      resourceType: CardResource.DATA,
      requirements: {tag: Tag.MARS, count: 2, all},
      victoryPoints: {resourcesHere: {}, per: 2},

      action: {
        addResourcesToAnyCard: {type: CardResource.DATA, count: 1},
      },

      metadata: {
        cardNumber: 'Pf35',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 data to ANY card.', (eb) => eb.empty().startAction.resource(CardResource.DATA).asterix());
        }),
        description: 'Requires any 2 Mars tags in play.  1 VP for every 2 data here.',
      },
    });
  }
}

