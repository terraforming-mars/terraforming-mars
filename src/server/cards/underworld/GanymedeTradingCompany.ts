import {PreludeCard} from '../prelude/PreludeCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';

export class GanymedeTradingCompany extends PreludeCard {
  constructor() {
    super({
      name: CardName.GANYMEDE_TRADING_COMPANY,
      tags: [Tag.JOVIAN, Tag.SPACE],

      behavior: {
        stock: {titanium: 3},
        colonies: {addTradeFleet: 1},
        underworld: {corruption: 1},
      },

      metadata: {
        cardNumber: 'UP08',
        renderData: CardRenderer.builder((b) => {
          b.corruption().titanium(3).tradeFleet();
        }),
        description: 'Gain 1 corruption, 3 titanium, and a trade fleet.',
      },
    });
  }
}

