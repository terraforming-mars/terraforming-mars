import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Tag} from '../../../common/cards/Tag';

export class Acidizing extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.ACIDIZING,
      type: CardType.AUTOMATED,
      cost: 10,
      tags: [Tag.VENUS, Tag.BUILDING],

      behavior: {
        global: {
          venus: 1,
        },
        underworld: {
          excavate: 1,
        },
      },

      metadata: {
        cardNumber: 'U098',
        renderData: CardRenderer.builder((b) => {
          b.venus(1).excavate(1);
        }),
        description: 'Raise Venus 1 step. Excavate an underground resource.',
      },
    });
  }
}
