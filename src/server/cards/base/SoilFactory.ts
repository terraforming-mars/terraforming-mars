import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class SoilFactory extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.SOIL_FACTORY,
      tags: [Tag.BUILDING],
      cost: 9,

      behavior: {
        production: {energy: -1, plants: 1},
      },
      victoryPoints: 1,

      metadata: {
        cardNumber: '179',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(1).br;
            pb.plus().plants(1);
          });
        }),
        description: 'Decrease your energy production 1 step and increase your plant production 1 step.',
      },
    });
  }
}
