import {IProjectCard} from '../IProjectCard';
import {ActionCard} from '../ActionCard';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {IActionCard} from '../ICard';
import {Tag} from '../../../common/cards/Tag';
import {CardResource} from '../../../common/CardResource';

export class Anthozoa extends ActionCard implements IProjectCard, IActionCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.ANTHOZOA,
      cost: 9,
      tags: [Tag.PLANT, Tag.ANIMAL, Tag.MARS],
      requirements: {oceans: 3},
      resourceType: CardResource.ANIMAL,
      victoryPoints: {resourcesHere: {}, per: 2},

      action: {
        spend: {plants: 1},
        addResources: 1,
      },

      metadata: {
        cardNumber: 'Pf55',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 1 plant to add an animal to this card.', (eb) => {
            eb.plants(1).startAction.resource(CardResource.ANIMAL);
          });
          b.br.vpText('1 VP per 2 animals on this card.');
        }),
        description: 'Requires 3 oceans on Mars.',
      },
    });
  }
}

