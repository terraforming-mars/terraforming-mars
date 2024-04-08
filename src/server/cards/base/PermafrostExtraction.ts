import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class PermafrostExtraction extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.PERMAFROST_EXTRACTION,
      cost: 8,

      behavior: {
        ocean: {},
      },

      requirements: {temperature: -8},
      metadata: {
        cardNumber: '191',
        renderData: CardRenderer.builder((b) => {
          b.oceans(1);
        }),
        description: 'Requires -8 C or warmer. Place 1 ocean tile.',
      },
    });
  }
}
