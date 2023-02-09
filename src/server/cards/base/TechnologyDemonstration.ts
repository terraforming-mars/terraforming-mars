import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class TechnologyDemonstration extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.TECHNOLOGY_DEMONSTRATION,
      tags: [Tag.SCIENCE, Tag.SPACE],
      cost: 5,

      behavior: {
        drawCard: 2,
      },

      metadata: {
        cardNumber: '204',
        renderData: CardRenderer.builder((b) => {
          b.cards(2);
        }),
        description: 'Draw two cards.',
      },
    });
  }
}

