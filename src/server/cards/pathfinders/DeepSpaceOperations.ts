import {PreludeCard} from '../prelude/PreludeCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';

export class DeepSpaceOperations extends PreludeCard {
  constructor() {
    super({
      name: CardName.DEEP_SPACE_OPERATIONS,
      tags: [Tag.SPACE],

      behavior: {
        stock: {titanium: 4},
        drawCard: {count: 2, tag: Tag.SPACE, type: CardType.EVENT},
      },

      metadata: {
        cardNumber: 'PfP12',
        renderData: CardRenderer.builder((b) => {
          b.titanium(4).br;
          b.cards(2, {secondaryTag: Tag.EVENT}).super((sb) => sb.tag(Tag.SPACE));
        }),
        description: 'Gain 4 titanium. Draw 2 event cards with a space tag.',
      },
    });
  }
}

