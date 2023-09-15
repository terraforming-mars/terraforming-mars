import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {max} from '../Options';

export class SpinInducingAsteroid extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.SPIN_INDUCING_ASTEROID,
      cost: 16,
      tags: [Tag.SPACE],

      behavior: {
        global: {venus: 2},
      },

      requirements: {venus: 10, max},
      metadata: {
        cardNumber: '246',
        renderData: CardRenderer.builder((b) => {
          b.venus(2);
        }),
        description: 'Venus must be 10% or lower. Raise Venus 2 steps.',
      },
    });
  }
}
