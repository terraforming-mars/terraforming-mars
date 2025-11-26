import {Tag} from '@/common/cards/Tag';
import {IProjectCard} from '@/server/cards/IProjectCard';
import {Card} from '@/server/cards/Card';
import {CardType} from '@/common/cards/CardType';
import {CardName} from '@/common/cards/CardName';
import {CardRenderer} from '@/server/cards/render/CardRenderer';

export class InvestmentLoan extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.INVESTMENT_LOAN,
      tags: [Tag.EARTH],
      cost: 3,

      behavior: {
        production: {megacredits: -1},
        stock: {megacredits: 10},
      },

      metadata: {
        cardNumber: '151',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(-1)).nbsp.megacredits(10);
        }),
        description: 'Decrease your M€ production 1 step. Gain 10 M€.',
      },
    });
  }
}
