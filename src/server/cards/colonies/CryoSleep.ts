import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';

export class CryoSleep extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 10,
      tags: [Tag.SCIENCE],
      name: CardName.CRYO_SLEEP,
      cardType: CardType.ACTIVE,
      victoryPoints: 1,

      behavior: {
        colonies: {tradeDiscount: 1},
      },

      metadata: {
        cardNumber: 'C07',
        renderData: CardRenderer.builder((b) => b.effect('When you trade, you pay 1 less resource for it.', (be) => {
          be.trade().startEffect.tradeDiscount(1);
        })),
      },
    });
  }
}
