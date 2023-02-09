import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {IProjectCard} from '../IProjectCard';

export class GiantSolarShade extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.GIANT_SOLAR_SHADE,
      cardType: CardType.AUTOMATED,
      tags: [Tag.SPACE, Tag.VENUS],
      cost: 27,

      behavior: {
        global: {venus: 3},
      },

      metadata: {
        cardNumber: '229',
        renderData: CardRenderer.builder((b) => b.venus(3)),
        description: 'Raise Venus 3 steps.',
      },
    });
  }
}

