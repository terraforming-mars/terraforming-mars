
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {max} from '../Options';

export class CupolaCity extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.CUPOLA_CITY,
      tags: [Tag.CITY, Tag.BUILDING],
      cost: 16,

      behavior: {
        production: {energy: -1, megacredits: 3},
        city: {},
      },

      requirements: {oxygen: 9, max},
      metadata: {
        cardNumber: '029',
        description: 'Oxygen must be 9% or less. Place a city tile. Decrease your energy production 1 step and increase your M€ production 3 steps.',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(1).br;
            pb.plus().megacredits(3);
          }).nbsp.nbsp.city();
        }),
      },
    });
  }
}
