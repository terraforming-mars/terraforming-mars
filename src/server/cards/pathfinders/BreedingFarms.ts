import {IProjectCard} from '../IProjectCard';
import {ActionCard} from '../ActionCard';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardResource} from '../../../common/CardResource';
import {Tag} from '../../../common/cards/Tag';

export class BreedingFarms extends ActionCard implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.BREEDING_FARMS,
      cost: 16,
      tags: [Tag.SCIENCE, Tag.ANIMAL, Tag.BUILDING],

      behavior: {
        global: {temperature: 1},
      },

      action: {
        spend: {plants: 1},
        addResourcesToAnyCard: {count: 1, type: CardResource.ANIMAL, mustHaveCard: true},
      },

      requirements: [{tag: Tag.SCIENCE}, {tag: Tag.ANIMAL}],
      metadata: {
        cardNumber: 'Pf01',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 1 plant to add 1 animal to ANY card.', (eb) => {
            eb.plants(1).startAction.resource(CardResource.ANIMAL);
          });
          b.br;
          b.temperature(1);
        }),
        description: 'Requires 1 science tag and 1 animal tag. Raise the temperature 1 step.',
      },
    });
  }
}

