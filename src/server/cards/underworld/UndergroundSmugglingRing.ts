import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {digit} from '../Options';

export class UndergroundSmugglingRing extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.UNDERGROUND_SMUGGLING_RING,
      cost: 8,

      requirements: {excavation: 1},

      behavior: {
        underworld: {corruption: 1},
        standardResource: {count: 2, same: true},
      },

      metadata: {
        cardNumber: 'U28',
        renderData: CardRenderer.builder((b) => {
          b.corruption(1).wild(2, {digit});
        }),
        description: 'Requires an excavation marker. Gain 1 corruption and 2 of the same standard resource.',
      },
    });
  }
}
