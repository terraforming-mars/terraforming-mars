import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {ActionCard} from '../ActionCard';
import {CardType} from '../../../common/cards/CardType';
import {CardResource} from '../../../common/CardResource';
import {Resources} from '../../../common/Resources';
import {CardName} from '../../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {all} from '../Options';

export class Fish extends ActionCard implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.FISH,
      tags: [Tag.ANIMAL],
      cost: 9,

      behavior: {
        decreaseAnyProduction: {type: Resources.PLANTS, count: 1},
      },

      action: {
        addResources: 1,
      },

      resourceType: CardResource.ANIMAL,
      victoryPoints: {resourcesHere: {}},
      requirements: CardRequirements.builder((b) => b.temperature(2)),

      metadata: {
        cardNumber: '052',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 animal to this card.', (eb) => {
            eb.empty().startAction.animals(1);
          }).br;
          b.production((pb) => pb.minus().plants(1, {all})).br;
          b.vpText('1 VP for each animal on this card.');
        }),
        description: {
          text: 'Requires +2 C° or warmer. Decrease any plant production 1 step.',
          align: 'left',
        },
      },
    });
  }
}
