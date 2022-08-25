import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../../common/Units';

export class FoodFactory extends Card implements IProjectCard {
  public migrated = true;
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.FOOD_FACTORY,
      tags: [Tag.BUILDING],
      cost: 12,
      productionBox: Units.of({megacredits: 4, plants: -1}),
      victoryPoints: 1,

      metadata: {
        cardNumber: '041',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().plants(1).br;
            pb.plus().megacredits(4);
          });
        }),
        description: 'Decrease your Plant production 1 step and increase your M€ production 4 steps',
      },
    });
  }
  public play() {
    return undefined;
  }
}
