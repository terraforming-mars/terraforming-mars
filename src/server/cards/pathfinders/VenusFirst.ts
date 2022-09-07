import {PreludeCard} from '../prelude/PreludeCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';

export class VenusFirst extends PreludeCard {
  constructor() {
    super({
      name: CardName.VENUS_FIRST_PATHFINDERS,
      tags: [Tag.VENUS],

      behavior: {
        drawCard: {count: 2, tag: Tag.VENUS},
        global: {venus: 2},
      },

      metadata: {
        cardNumber: '',
        renderData: CardRenderer.builder((b) => {
          b.venus(2).br.br;
          b.cards(2, {secondaryTag: Tag.VENUS});
        }),
        description: 'Raise Venus 2 steps. Draw 2 Venus cards.',
      },
    });
  }
}
