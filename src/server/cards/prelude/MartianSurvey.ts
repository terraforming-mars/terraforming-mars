import {IProjectCard} from '@/server/cards/IProjectCard';
import {Tag} from '@/common/cards/Tag';
import {CardType} from '@/common/cards/CardType';
import {Card} from '@/server/cards/Card';
import {CardName} from '@/common/cards/CardName';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {max} from '@/server/cards/Options';

export class MartianSurvey extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.MARTIAN_SURVEY,
      tags: [Tag.SCIENCE],
      cost: 9,
      victoryPoints: 1,

      behavior: {
        drawCard: 2,
      },

      requirements: {oxygen: 4, max},
      metadata: {
        cardNumber: 'P38',
        renderData: CardRenderer.builder((b) => {
          b.cards(2);
        }),
        description: 'Oxygen must be 4% or lower. Draw two cards.',
      },
    });
  }
}
