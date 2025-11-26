import {CardType} from '@/common/cards/CardType';
import {CardName} from '@/common/cards/CardName';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {Size} from '@/common/cards/render/Size';
import {Card} from '@/server/cards/Card';
import {all} from '@/server/cards/Options';
import {IProjectCard} from '@/server/cards/IProjectCard';


export class AerosportTournament extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.AEROSPORT_TOURNAMENT,
      type: CardType.EVENT,
      cost: 7,

      requirements: {floaters: 5},
      victoryPoints: 1,

      behavior: {
        stock: {megacredits: {cities: {}}},
      },

      metadata: {
        cardNumber: '214',
        description: 'Requires that you have 5 floaters. Gain 1 M€ per each city tile in play.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(1).slash().city({size: Size.SMALL, all});
        }),
      },
    });
  }
}
