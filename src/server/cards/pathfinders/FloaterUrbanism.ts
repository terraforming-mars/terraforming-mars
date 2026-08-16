import {IProjectCard} from '../IProjectCard';
import {IActionCard} from '../ICard';
import {ActionCard} from '../ActionCard';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardResource} from '../../../common/CardResource';
import {Tag} from '../../../common/cards/Tag';

export class FloaterUrbanism extends ActionCard implements IProjectCard, IActionCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.FLOATER_URBANISM,
      cost: 7,
      tags: [Tag.VENUS],
      resourceType: CardResource.VENUSIAN_HABITAT,
      requirements: {tag: Tag.VENUS, count: 4},
      victoryPoints: {resourcesHere: {}},

      action: {
        removeResourcesFromAnyCard: {type: CardResource.FLOATER, source: 'self'},
        addResources: 1,
      },

      metadata: {
        cardNumber: 'Pf59',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 1 floater from any card to add 1 Venusian habitat on this card.', (ab) => {
            ab.minus().resource(CardResource.FLOATER).startAction.resource(CardResource.VENUSIAN_HABITAT);
          }).br;
          b.vpText('1 VP for every Venusian habitat on this card.');
        }),
        description: 'Requires 4 Venus tags.',
      },
    });
  }
}
