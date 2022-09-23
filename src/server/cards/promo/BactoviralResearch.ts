import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {played} from '../Options';

export class BactoviralResearch extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.BACTOVIRAL_RESEARCH,
      tags: [Tag.MICROBE, Tag.SCIENCE],
      cost: 10,

      behavior: {
        drawCard: 1,
        addResourcesToAnyCard: {count: {tag: Tag.SCIENCE}, tag: Tag.MICROBE},
      },

      metadata: {
        cardNumber: 'X35',
        renderData: CardRenderer.builder((b) => {
          b.cards(1).br.br; // double br is intentional for visual appeal
          b.microbes(1).asterix().slash().science(1, {played});
        }),
        description: 'Draw 1 card. Choose 1 of your played cards and add 1 microbe to it for each science tag you have, including this.',
      },
    });
  }
}
