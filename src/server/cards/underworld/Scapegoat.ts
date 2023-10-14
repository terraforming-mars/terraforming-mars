import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class Scapegoat extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.SCAPEGOAT,
      type: CardType.EVENT,
      cost: 5,

      behavior: {
        underworld: {corruption: 1},
      },

      metadata: {
        cardNumber: 'U40',
        renderData: CardRenderer.builder((b) => {
          b.corruption(1);
        }),
        description: 'Gain 1 corruption.',
      },
    });
  }
}
