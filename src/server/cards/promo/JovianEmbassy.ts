import {IProjectCard} from '@/server/cards/IProjectCard';
import {Tag} from '@/common/cards/Tag';
import {Card} from '@/server/cards/Card';
import {CardType} from '@/common/cards/CardType';
import {CardName} from '@/common/cards/CardName';
import {CardRenderer} from '@/server/cards/render/CardRenderer';

export class JovianEmbassy extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.JOVIAN_EMBASSY,
      tags: [Tag.JOVIAN, Tag.BUILDING],
      cost: 14,
      victoryPoints: 1,

      behavior: {
        tr: 1,
      },

      metadata: {
        cardNumber: 'X23',
        renderData: CardRenderer.builder((b) => {
          b.tr(1);
        }),
        description: 'Raise your TR 1 step.',
      },
    });
  }
}
