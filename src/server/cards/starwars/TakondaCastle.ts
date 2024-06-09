import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class TakondaCastle extends Card {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.TAKONDA_CASTLE,
      tags: [Tag.POWER, Tag.PLANT],
      cost: 2,

      behavior: {
        stock: {megacredits: {tag: [Tag.MICROBE, Tag.ANIMAL]}},
      },

      metadata: {
        cardNumber: 'SW07',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(1).slash().tag(Tag.MICROBE).tag(Tag.ANIMAL);
        }),
        description: 'Gain 1 M€ for each of your microbe tags and animal tags.',
      },
    });
  }
}
