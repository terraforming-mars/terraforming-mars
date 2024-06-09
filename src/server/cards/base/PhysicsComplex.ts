import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {ActionCard} from '../ActionCard';
import {CardType} from '../../../common/cards/CardType';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {digit} from '../Options';

export class PhysicsComplex extends ActionCard implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.PHYSICS_COMPLEX,
      tags: [Tag.SCIENCE, Tag.BUILDING],
      cost: 12,

      resourceType: CardResource.SCIENCE,
      victoryPoints: {resourcesHere: {}, each: 2},

      action: {
        spend: {energy: 6},
        addResources: 1,
      },

      metadata: {
        cardNumber: '095',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 6 energy to add a science resource to this card.', (eb) => {
            eb.energy(6, {digit}).startAction.resource(CardResource.SCIENCE);
          }).br;
          b.vpText('2 VP for each science resource on this card.');
        }),
      },
    });
  }
}
