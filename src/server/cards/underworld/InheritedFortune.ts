import {PreludeCard} from '../prelude/PreludeCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';

export class InheritedFortune extends PreludeCard {
  constructor() {
    super({
      name: CardName.INHERITED_FORTUNE,
      tags: [Tag.EARTH],

      behavior: {
        production: {megacredits: 1},
        stock: {megacredits: 10},
        underworld: {corruption: 1},
      },

      metadata: {
        cardNumber: 'UP02',
        renderData: CardRenderer.builder((b) => {
          b.corruption().megacredits(1).production((pb) => pb.megacredits(1));
        }),
        description: 'Gain 1 corruption and 10 M€. Increase your M€ production 1 step.',
      },
    });
  }
}

