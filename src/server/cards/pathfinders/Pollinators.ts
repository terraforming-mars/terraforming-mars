import {IProjectCard} from '../IProjectCard';
import {ActionCard} from '../ActionCard';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardResource} from '../../../common/CardResource';
import {Tag} from '../../../common/cards/Tag';

export class Pollinators extends ActionCard implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.POLLINATORS,
      cost: 19,
      tags: [Tag.PLANT, Tag.ANIMAL],
      resourceType: CardResource.ANIMAL,
      requirements: {tag: Tag.PLANT, count: 3},
      victoryPoints: {resourcesHere: {}},

      behavior: {
        production: {plants: 1, megacredits: 2},
      },

      action: {
        addResources: 1,
      },

      metadata: {
        cardNumber: '...',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 animal on this card', (ab) => ab.empty().startAction.resource(CardResource.ANIMAL)).br;
          b.production((pb) => pb.plants(1).megacredits(2));
          b.vpText('1 VP per animal on this card.');
        }),
        description: 'Requires 3 plant tags. Raise your plant production 1 step and your M€ production 2 steps.',
      },
    });
  }
}
