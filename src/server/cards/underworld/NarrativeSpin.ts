import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Tag} from '../../../common/cards/Tag';

export class NarrativeSpin extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.NARRATIVE_SPIN,
      type: CardType.EVENT,
      cost: 5,
      tags: [Tag.CRIME],

      behavior: {
        underworld: {corruption: 2},
      },

      requirements: {tag: Tag.EARTH, count: 1},
      victoryPoints: -1,

      metadata: {
        cardNumber: 'U37',
        renderData: CardRenderer.builder((b) => {
          b.corruption(2);
        }),
        description: 'Requires 1 Earth tag. Gain 2 corruption.',
      },
    });
  }
}
