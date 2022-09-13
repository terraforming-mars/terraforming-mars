import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class ResearchColony extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 20,
      tags: [Tag.SPACE, Tag.SCIENCE],
      name: CardName.RESEARCH_COLONY,
      cardType: CardType.AUTOMATED,

      behavior: {
        drawCard: 2,
        colonies: {buildColony: {allowDuplicates: true}},
      },

      metadata: {
        cardNumber: 'C34',
        renderData: CardRenderer.builder((b) => {
          b.colonies(1).asterix().nbsp.cards(2);
        }),
        description: 'Place a colony. MAY BE PLACED WHERE YOU ALREADY HAVE A COLONY. Draw 2 cards.',
      },
    });
  }
}
