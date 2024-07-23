import {PreludeCard} from '../prelude/PreludeCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';

export class VenusL1Shade extends PreludeCard {
  constructor() {
    super({
      name: CardName.VENUS_L1_SHADE,
      tags: [Tag.SPACE],
      behavior: {
        global: {venus: 3},
      },

      metadata: {
        cardNumber: 'P66',
        renderData: CardRenderer.builder((b) => {
          b.venus(3);
        }),
        description: 'Raise Venus 3 steps.',
      },
    });
  }
}

