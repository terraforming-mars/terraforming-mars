import {ActionCard} from '../ActionCard';
import {CardName} from '../../../common/cards/CardName';
import {CardResource} from '../../../common/CardResource';
import {CardType} from '../../../common/cards/CardType';
import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';

export class BioengineeringEnclosure extends ActionCard implements IProjectCard, IActionCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.BIOENGINEERING_ENCLOSURE,
      tags: [Tag.ANIMAL],
      cost: 7,
      resourceType: CardResource.ANIMAL,
      protectedResources: true,

      behavior: {
        addResources: 2,
      },

      action: {
        spend: {resourcesHere: 1},
        addResourcesToAnyCard: {
          count: 1,
          type: CardResource.ANIMAL,
          excludeThis: true,
          mustHaveCard: true,
        },
      },

      requirements: {tag: Tag.SCIENCE},
      metadata: {
        description: 'Requires 1 science tag to play. Add 2 animals to this card. OTHERS MAY NOT REMOVE ANIMALS FROM THIS CARD.',
        cardNumber: 'A01',
        renderData: CardRenderer.builder((b) => {
          b.action('Remove 1 animal from THIS card to add 1 animal to ANOTHER card.', (eb) => {
            eb.resource(CardResource.ANIMAL).asterix().startAction.resource(CardResource.ANIMAL).asterix();
          }).br;
          b.resource(CardResource.ANIMAL, 2);
        }),
      },
    });
  }
}
