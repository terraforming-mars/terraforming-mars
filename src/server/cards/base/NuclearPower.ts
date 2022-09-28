import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class NuclearPower extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.NUCLEAR_POWER,
      tags: [Tag.ENERGY, Tag.BUILDING],
      cost: 10,

      behavior: {
        production: {energy: 3, megacredits: -2},
      },

      metadata: {
        cardNumber: '045',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().megacredits(2).br;
            pb.plus().energy(3);
          });
        }),
        description: 'Decrease your M€ production 2 steps and increase your energy production 3 steps.',
      },
    });
  }
}
