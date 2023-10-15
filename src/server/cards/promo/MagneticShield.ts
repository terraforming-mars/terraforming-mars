import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {digit} from '../Options';

export class MagneticShield extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.MAGNETIC_SHIELD,
      tags: [Tag.SPACE],
      cost: 24,

      behavior: {
        tr: 4,
      },

      requirements: {tag: Tag.POWER, count: 3},
      metadata: {
        cardNumber: 'X24',
        renderData: CardRenderer.builder((b) => b.tr(4, {digit})),
        description: 'Requires 3 power tags. Raise your TR 4 steps.',
      },
    });
  }
}
