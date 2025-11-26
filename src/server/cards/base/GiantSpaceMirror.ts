import {IProjectCard} from '@/server/cards/IProjectCard';
import {Tag} from '@/common/cards/Tag';
import {Card} from '@/server/cards/Card';
import {CardType} from '@/common/cards/CardType';
import {CardName} from '@/common/cards/CardName';
import {CardRenderer} from '@/server/cards/render/CardRenderer';

export class GiantSpaceMirror extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.GIANT_SPACE_MIRROR,
      tags: [Tag.POWER, Tag.SPACE],
      cost: 17,

      behavior: {
        production: {energy: 3},
      },

      metadata: {
        cardNumber: '083',
        renderData: CardRenderer.builder((b) => b.production((pb) => pb.energy(3))),
        description: 'Increase your energy production 3 steps.',
      },
    });
  }
}
