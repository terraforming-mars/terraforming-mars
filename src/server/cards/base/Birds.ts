import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {ActionCard} from '../ActionCard';
import {CardType} from '../../../common/cards/CardType';
import {Resources} from '../../../common/Resources';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
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
      requirements: CardRequirements.builder((b) => b.oxygen(13)),
      victoryPoints: {type: 'resource', points: 1, per: 1},

      behavior: {
        decreaseAnyProduction: {type: Resources.PLANTS, count: 2},
      },

      action: {
        addResources: 1,
      },

      metadata: {
        cardNumber: '072',
        description: 'Requires 13% oxygen. Decrease any plant production 2 steps. 1 VP per animal on this card.',
        renderData: CardRenderer.builder((b) => {
          b.action('Add an animal to this card.', (eb) => {
            eb.empty().startAction.animals(1);
          }).br;
          b.production((pb) => {
            pb.minus().plants(-2, {all});
          });
        }),
      },
    });
  }
}
