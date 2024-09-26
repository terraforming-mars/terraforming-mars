import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';

// Note: Casinos comes from WSBG.
// https://boardgamegeek.com/thread/3375070/wsbg-promo-card

export class Casinos extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 5,
      name: CardName.CASINOS,
      tags: [Tag.BUILDING],
      type: CardType.AUTOMATED,
      behavior: {
        production: {energy: -1, megacredits: 4},
      },
      requirements: {cities: 1},

      metadata: {
        cardNumber: 'X72',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.minus().energy(1).plus().megacredits(4));
        }),
        description: 'Requires that you have a city. Decrease your energy production 1 step and increase your M€ production 4 steps.',
      },
    });
  }
}
