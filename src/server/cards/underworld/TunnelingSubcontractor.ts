import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class TunnelingSubcontractor extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.TUNNELING_SUBCONTRACTOR,
      cost: 9,

      behavior: {
        underworld: {corruption: 1, excavate: 1},
      },

      metadata: {
        cardNumber: 'U07',
        renderData: CardRenderer.builder((b) => {
          b.corruption(1).excavate(1);
        }),
        description: 'Gain 1 corruption. Excavate an underground resource.',
      },
    });
  }
}
