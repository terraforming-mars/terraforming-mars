import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class LagrangeObservatory extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.LAGRANGE_OBSERVATORY,
      tags: [Tag.SCIENCE, Tag.SPACE],
      cost: 9,
      victoryPoints: 1,

      behavior: {
        drawCard: 1,
      },

      metadata: {
        cardNumber: '196',
        renderData: CardRenderer.builder((b) => b.cards(1)),
        description: 'Draw 1 card.',
      },
    });
  }
}
