import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Size} from '../../../common/cards/render/Size';

export class TradingColony extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 18,
      tags: [Tag.SPACE],
      name: CardName.TRADING_COLONY,
      cardType: CardType.ACTIVE,

      behavior: {
        colonies: {
          buildColony: {},
          tradeOffset: 1,
        },
      },

      metadata: {
        cardNumber: 'C47',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you trade, you may first increase that Colony Tile track 1 step.', (eb) => {
            eb.trade().startEffect.text('+1', Size.LARGE);
          }).br;
          b.colonies(1);
        }),
        description: 'Place a colony.',
      },
    });
  }
}
