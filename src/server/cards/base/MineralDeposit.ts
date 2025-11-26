import {IProjectCard} from '@/server/cards/IProjectCard';
import {Card} from '@/server/cards/Card';
import {CardType} from '@/common/cards/CardType';
import {CardName} from '@/common/cards/CardName';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {digit} from '@/server/cards/Options';

export class MineralDeposit extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.MINERAL_DEPOSIT,
      cost: 5,

      behavior: {
        stock: {steel: 5},
      },

      metadata: {
        cardNumber: '062',
        renderData: CardRenderer.builder((b) => b.steel(5, {digit})),
        description: 'Gain 5 steel.',
      },
    });
  }
}
