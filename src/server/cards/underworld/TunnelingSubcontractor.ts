import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Tag} from '../../../common/cards/Tag';

export class TunnelingSubcontractor extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.TUNNELING_SUBCONTRACTOR,
      tags: [Tag.CRIME],
      cost: 9,

      behavior: {
        underworld: {corruption: 1, excavate: 1},
      },

      metadata: {
        cardNumber: 'U18',
        renderData: CardRenderer.builder((b) => {
          b.corruption(1).excavate(1);
        }),
        description: 'Gain 1 corruption. Excavate an underground resource.',
      },
    });
  }
}
