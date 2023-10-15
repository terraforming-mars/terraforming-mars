import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';

export class Psyche extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.PSYCHE,
      tags: [Tag.SPACE],
      cost: 31,
      victoryPoints: 2,
      behavior: {
        production: {titanium: 2},
        stock: {titanium: 3},
      },

      metadata: {
        cardNumber: 'X44',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.titanium(2)).br.titanium(3);
        }),
        description: 'Increase titanium production 2 steps. Gain 3 titanium.',
      },
    });
  }
}
