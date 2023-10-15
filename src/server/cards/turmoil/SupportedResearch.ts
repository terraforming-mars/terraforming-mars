import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {PartyName} from '../../../common/turmoil/PartyName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class SupportedResearch extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 3,
      tags: [Tag.SCIENCE],
      name: CardName.SUPPORTED_RESEARCH,
      type: CardType.AUTOMATED,

      behavior: {
        drawCard: 2,
      },

      requirements: {party: PartyName.SCIENTISTS},
      metadata: {
        cardNumber: 'T14',
        renderData: CardRenderer.builder((b) => {
          b.cards(2);
        }),
        description: 'Requires that Scientists are ruling or that you have 2 delegates there. Draw 2 cards.',
      },
    });
  }
}
