import {IProjectCard} from '@/server/cards/IProjectCard';
import {Card} from '@/server/cards/Card';
import {CardType} from '@/common/cards/CardType';
import {CardName} from '@/common/cards/CardName';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {all} from '@/server/cards/Options';

export class RadSuits extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.RAD_SUITS,
      cost: 6,
      victoryPoints: 1,

      behavior: {
        production: {megacredits: 1},
      },

      requirements: {cities: 2, all},
      metadata: {
        cardNumber: '186',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(1));
        }),
        description: 'Requires two cities in play. Increase your M€ production 1 step.',
      },
    });
  }
}
