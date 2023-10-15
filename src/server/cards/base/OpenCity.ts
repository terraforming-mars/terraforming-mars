import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class OpenCity extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.OPEN_CITY,
      tags: [Tag.CITY, Tag.BUILDING],
      cost: 23,
      requirements: {oxygen: 12},
      victoryPoints: 1,

      behavior: {
        production: {energy: -1, megacredits: 4},
        stock: {plants: 2},
        city: {},
      },

      metadata: {
        cardNumber: '108',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(1).br;
            pb.plus().megacredits(4);
          }).city().plants(2);
        }),
        description: {
          text: 'Requires 12% oxygen. Gain 2 plants. Place a city tile. Decrease your energy production 1 step and increase your M€ production 4 steps.',
          align: 'left',
        },
      },
    });
  }
}
