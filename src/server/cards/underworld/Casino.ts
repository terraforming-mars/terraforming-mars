import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Tag} from '../../../common/cards/Tag';
import {all} from '../Options';

export class Casino extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.CASINO,
      tags: [Tag.BUILDING],
      cost: 12,

      requirements: {cities: 1, all},

      behavior: {
        production: {megacredits: 2},
        underworld: {corruption: 1},
      },

      metadata: {
        cardNumber: 'U20',
        renderData: CardRenderer.builder((b) => {
          b.corruption();
          b.production((pb) => pb.megacredits(2));
        }),
        description: 'Requires at least 1 city tile in play. Gain 1 corruption. Increase your M€ production 2 steps.',
      },
    });
  }
}
