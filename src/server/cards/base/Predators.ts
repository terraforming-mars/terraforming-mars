import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {ActionCard} from '../ActionCard';
import {CardType} from '../../../common/cards/CardType';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {all} from '../Options';

export class Predators extends ActionCard implements IProjectCard, IActionCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.PREDATORS,
      tags: [Tag.ANIMAL],
      cost: 14,

      resourceType: CardResource.ANIMAL,
      victoryPoints: {resourcesHere: {}},
      requirements: {oxygen: 11},

      action: {
        removeResourcesFromAnyCard: {type: CardResource.ANIMAL, source: 'all'},
        addResources: 1,
      },

      metadata: {
        cardNumber: '024',
        renderData: CardRenderer.builder((b) => {
          b.action('Remove 1 animal from any card and add it to this card.', (eb) => {
            eb.resource(CardResource.ANIMAL, {all}).startAction.resource(CardResource.ANIMAL);
          }).br;
          b.vpText('1 VP per animal on this card.');
        }),
        description: 'Requires 11% oxygen.',
      },
    });
  }
}
