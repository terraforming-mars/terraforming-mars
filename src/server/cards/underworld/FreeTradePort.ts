import {PreludeCard} from '../prelude/PreludeCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';

export class FreeTradePort extends PreludeCard {
  constructor() {
    super({
      name: CardName.FREE_TRADE_PORT,
      tags: [Tag.EARTH, Tag.SPACE],

      behavior: {
        colonies: {buildColony: {}},
        underworld: {corruption: 1},
      },

      metadata: {
        cardNumber: 'UP01',
        renderData: CardRenderer.builder((b) => {
          b.corruption().colonies();
        }),
        description: 'Gain 1 corruption. Place a colony.',
      },
    });
  }
}

