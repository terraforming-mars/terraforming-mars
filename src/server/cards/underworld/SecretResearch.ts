import {PreludeCard} from '../prelude/PreludeCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';

export class SecretResearch extends PreludeCard {
  constructor() {
    super({
      name: CardName.SECRET_RESEARCH,
      tags: [Tag.SCIENCE],

      behavior: {
        drawCard: 3,
        underworld: {corruption: 1},
      },

      metadata: {
        cardNumber: 'UP12',
        renderData: CardRenderer.builder((b) => {
          b.corruption().cards(3);
        }),
        description: 'Gain 1 corruption and draw 3 cards.',
      },
    });
  }
}

