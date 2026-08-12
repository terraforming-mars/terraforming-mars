import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {ActionCard} from '../ActionCard';
import {CardType} from '../../../common/cards/CardType';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {all} from '../Options';

export class Ants extends ActionCard implements IActionCard, IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.ANTS,
      tags: [Tag.MICROBE],
      cost: 9,

      resourceType: CardResource.MICROBE,
      victoryPoints: {resourcesHere: {}, per: 2},
      requirements: {oxygen: 4},

      action: {
        removeResourcesFromAnyCard: {type: CardResource.MICROBE, source: 'all'},
        addResources: 1,
      },

      metadata: {
        cardNumber: '035',
        description: 'Requires 4% oxygen.',
        renderData: CardRenderer.builder((b) => {
          b.action('Remove 1 microbe from any card to add 1 to this card.', (eb) => {
            eb.resource(CardResource.MICROBE, {all}).startAction.resource(CardResource.MICROBE);
          }).br;
          b.vpText('1 VP per 2 microbes on this card.');
        }),
      },
    });
  }
}
