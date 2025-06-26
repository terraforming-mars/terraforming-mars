import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {PreludeCard} from '../prelude/PreludeCard';

export class SpaceLanes extends PreludeCard {
  constructor() {
    super({
      name: CardName.SPACE_LANES,
      tags: [Tag.SPACE],

      cardDiscount: [
        {tag: Tag.JOVIAN, amount: 2},
        {tag: Tag.EARTH, amount: 2},
        {tag: Tag.VENUS, amount: 2},
      ],

      behavior: {
        stock: {titanium: 3},
      },

      metadata: {
        cardNumber: 'P62',
        description: 'Gain 3 titanium.',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you play a Jovian, Earth, or Venus tag, you pay 2 M€ less for it.', (eb) => {
            eb.tag(Tag.JOVIAN).tag(Tag.EARTH).tag(Tag.VENUS).startEffect.megacredits(-2);
          });
          b.br;
          b.titanium(3);
        }),
      },
    });
  }
}

