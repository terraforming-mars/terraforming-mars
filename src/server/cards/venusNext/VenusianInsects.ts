import {IActionCard} from '../ICard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {ActionCard} from '../ActionCard';

export class VenusianInsects extends ActionCard implements IActionCard {
  constructor() {
    super({
      name: CardName.VENUSIAN_INSECTS,
      type: CardType.ACTIVE,
      tags: [Tag.VENUS, Tag.MICROBE],
      cost: 5,
      resourceType: CardResource.MICROBE,
      victoryPoints: {resourcesHere: {}, per: 2},

      action: {
        addResources: 1,
      },

      requirements: {venus: 12},
      metadata: {
        cardNumber: '260',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 microbe to this card.', (eb)=> {
            eb.empty().startAction.resource(CardResource.MICROBE);
          }).br;
          b.vpText('1 VP for every 2nd Microbe on this card.');
        }),
        description: 'Requires Venus 12%.',
      },
    });
  }
}
