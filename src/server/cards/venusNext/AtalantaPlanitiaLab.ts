import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {IProjectCard} from '../IProjectCard';

export class AtalantaPlanitiaLab extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.ATALANTA_PLANITIA_LAB,
      type: CardType.AUTOMATED,
      tags: [Tag.VENUS, Tag.SCIENCE],
      cost: 10,

      requirements: {tag: Tag.SCIENCE, count: 3},
      victoryPoints: 2,

      behavior: {
        drawCard: 2,
      },

      metadata: {
        cardNumber: '216',
        description: 'Requires 3 science tags. Draw 2 cards.',
        renderData: CardRenderer.builder((b) => b.cards(2)),
      },
    });
  }
}
