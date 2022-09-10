import {Tag} from '../../../common/cards/Tag';
import {PreludeCard} from './PreludeCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class Biolab extends PreludeCard {
  constructor() {
    super({
      name: CardName.BIOLAB,
      tags: [Tag.SCIENCE],

      behavior: {
        production: {plants: 1},
        drawCard: 3,
      },

      metadata: {
        cardNumber: 'P04',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.plants(1)).br;
          b.cards(3);
        }),
        description: 'Increase your plant production 1 step. Draw 3 cards.',
      },
    });
  }
}

