import {Tag} from '../../../common/cards/Tag';
import {PreludeCard} from '../prelude/PreludeCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {uppercase} from '../Options';

export class CorporateArchives extends PreludeCard {
  constructor() {
    super({
      name: CardName.CORPORATE_ARCHIVES,
      tags: [Tag.SCIENCE],

      behavior: {
        drawCard: {count: 7, keep: 2},
        stock: {megacredits: 13},
      },

      metadata: {
        cardNumber: 'X39',
        description: 'Gain 13 M€.',
        renderData: CardRenderer.builder((b) => {
          b.text('Look at the top 7 cards from the deck. Take 2 of them into hand and discard the other 5.', {size: Size.SMALL, uppercase});
          b.br;
          b.megacredits(13);
        }),
      },
    });
  }
}
