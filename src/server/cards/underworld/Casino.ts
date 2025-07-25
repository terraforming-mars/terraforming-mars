import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Tag} from '../../../common/cards/Tag';

export class Casino extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.CASINO,
      tags: [Tag.BUILDING, Tag.CRIME],
      cost: 15,

      requirements: {cities: 2},

      behavior: {
        production: {megacredits: 4},
        underworld: {corruption: 1},
      },

      metadata: {
        cardNumber: 'U020',
        renderData: CardRenderer.builder((b) => {
          b.corruption();
          b.production((pb) => pb.megacredits(4));
        }),
        description: 'Requires that you own 2 city tiles. Gain 1 corruption. Increase your M€ production 4 steps.',
      },
    });
  }
}
