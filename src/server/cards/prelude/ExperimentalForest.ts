import {Tag} from '../../../common/cards/Tag';
import {PreludeCard} from './PreludeCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class ExperimentalForest extends PreludeCard {
  constructor() {
    super({
      name: CardName.EXPERIMENTAL_FOREST,
      tags: [Tag.PLANT],

      behavior: {
        drawCard: {count: 2, tag: Tag.PLANT},
        greenery: {},
      },

      metadata: {
        cardNumber: 'P12',
        renderData: CardRenderer.builder((b) => {
          b.greenery().cards(2, {secondaryTag: Tag.PLANT});
        }),
        description: 'Place 1 Greenery Tile and raise oxygen 1 step. Reveal cards until you reveal two cards with plant tags on them. Take them into your hand and discard the rest.',
      },
    });
  }
}

