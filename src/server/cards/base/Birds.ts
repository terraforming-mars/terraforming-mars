import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {ActionCard} from '../ActionCard';
import {CardType} from '../../../common/cards/CardType';
import {Resource} from '../../../common/Resource';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {all} from '../Options';

export class Birds extends ActionCard implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.BIRDS,
      tags: [Tag.ANIMAL],
      cost: 10,

      resourceType: CardResource.ANIMAL,
      requirements: {oxygen: 13},
      victoryPoints: {resourcesHere: {}},

      behavior: {
        decreaseAnyProduction: {type: Resource.PLANTS, count: 2},
      },

      action: {
        addResources: 1,
      },

      metadata: {
        cardNumber: '072',
        description: 'Requires 13% oxygen. Decrease any plant production 2 steps. 1 VP per animal on this card.',
        renderData: CardRenderer.builder((b) => {
          b.action('Add an animal to this card.', (eb) => {
            eb.empty().startAction.resource(CardResource.ANIMAL);
          }).br;
          b.production((pb) => {
            pb.minus().plants(-2, {all});
          });
        }),
      },
    });
  }
}
