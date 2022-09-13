import {IProjectCard} from '../IProjectCard';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Size} from '../../../common/cards/render/Size';

export class TradeEnvoys extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 6,
      name: CardName.TRADE_ENVOYS,
      cardType: CardType.ACTIVE,

      behavior: {
        colonies: {tradeOffset: 1},
      },

      metadata: {
        cardNumber: 'C46',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you trade, you may first increase that Colony Tile track 1 step.', (eb) => {
            eb.trade().startEffect.text('+1', Size.LARGE);
          });
        }),
      },
    });
  }
}
