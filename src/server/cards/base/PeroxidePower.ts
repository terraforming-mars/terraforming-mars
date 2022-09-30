import {Tag} from '../../../common/cards/Tag';
import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class PeroxidePower extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.PEROXIDE_POWER,
      tags: [Tag.ENERGY, Tag.BUILDING],
      cost: 7,

      behavior: {
        production: {energy: 2, megacredits: -1},
      },

      metadata: {
        cardNumber: '089',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().megacredits(1).br;
            pb.plus().energy(2);
          });
        }),
        description: 'Decrease your M€ production 1 step and increase your energy production 2 steps.',
      },
    });
  }
}
