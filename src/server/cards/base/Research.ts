import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class Research extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.RESEARCH,
      tags: [Tag.SCIENCE, Tag.SCIENCE],
      cost: 11,
      victoryPoints: 1,

      behavior: {
        drawCard: 2,
      },

      metadata: {
        cardNumber: '090',
        renderData: CardRenderer.builder((b) => {
          b.cards(2);
        }),
        description: 'Counts as playing 2 science cards. Draw 2 cards.',
      },
    });
  }
}
