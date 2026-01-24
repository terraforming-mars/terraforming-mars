import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {all} from '../Options';

export class Supermarkets extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.SUPERMARKETS,
      cost: 9,
      victoryPoints: 1,

      behavior: {
        production: {megacredits: 2},
      },

      requirements: {cities: 2, all},
      metadata: {
        cardNumber: 'X68',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(2));
        }),
        description: 'Requires two cities in play. Increase your M€ production 2 steps.',
      },
    });
  }
}
