import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class CarbonateProcessing extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.CARBONATE_PROCESSING,
      tags: [Tag.BUILDING],
      cost: 6,

      behavior: {
        production: {energy: -1, heat: 3},
      },

      metadata: {
        cardNumber: '043',
        description: 'Decrease your energy production 1 step and increase your heat production 3 steps.',
        renderData: CardRenderer.builder((b) => b.production((pb) => {
          pb.minus().energy(1).br;
          pb.plus().heat(3);
        })),
      },
    });
  }
}
