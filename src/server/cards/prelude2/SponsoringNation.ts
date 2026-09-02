import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardType} from '../../../common/cards/CardType';
import {Card} from '../Card';

export class SponsoringNation extends Card {
  constructor() {
    super({
      name: CardName.SPONSORING_NATION,
      type: CardType.AUTOMATED,
      tags: [Tag.EARTH],
      cost: 21,

      behavior: {
        tr: 3,
        turmoil: {sendDelegates: {count: 2}},
      },

      requirements: {tag: Tag.EARTH, count: 4},

      metadata: {
        cardNumber: 'P83',
        description: 'Requires 4 Earth tags. Gain 3 TR. Place 2 delegates.',
        renderData: CardRenderer.builder((b) => {
          b.tr(3).br.delegates(2);
        }),
      },
    });
  }
}
