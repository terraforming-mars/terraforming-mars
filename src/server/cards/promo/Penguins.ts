import {IProjectCard} from '../IProjectCard';
import {ActionCard} from '../ActionCard';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {CardResource} from '../../../common/CardResource';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';

export class Penguins extends ActionCard implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.PENGUINS,
      tags: [Tag.ANIMAL],
      cost: 7,
      resourceType: CardResource.ANIMAL,
      victoryPoints: {resourcesHere: {}},

      action: {
        addResources: 1,
      },

      requirements: {oceans: 8},
      metadata: {
        cardNumber: '212',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 animal to this card.', (eb) => {
            eb.empty().startAction.resource(CardResource.ANIMAL);
          }).br;
          b.vpText('1 VP for each animal on this card.');
        }),
        description: 'Requires 8 oceans.',
      },
    });
  }
}
