import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';

export class HeavyTaxation extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 3,
      tags: [Tag.EARTH],
      name: CardName.HEAVY_TAXATION,
      type: CardType.AUTOMATED,
      victoryPoints: -1,

      behavior: {
        production: {megacredits: 2},
        stock: {megacredits: 4},
      },

      requirements: {tag: Tag.EARTH, count: 2},
      metadata: {
        cardNumber: 'C14',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(2)).nbsp.megacredits(4);
        }),
        description: 'Requires 2 Earth tags. Increase your M€ production 2 steps, and gain 4 M€.',
      },
    });
  }
}
