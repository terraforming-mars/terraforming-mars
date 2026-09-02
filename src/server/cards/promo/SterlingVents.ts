import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class SterlingVents extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.STERLING_VENTS,
      tags: [Tag.POWER, Tag.BUILDING],
      cost: 5,
      victoryPoints: 1,

      behavior: {
        production: {heat: -2, energy: 2},
      },

      metadata: {
        description: 'Decrease heat production 2 steps. Increase energy production 2 steps.',
        cardNumber: 'X79',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().heat(2).br;
            pb.plus().energy(2);
          });
        }),
      },
    });
  }
}
