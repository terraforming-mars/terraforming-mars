import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class MagneticFieldDome extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.MAGNETIC_FIELD_DOME,
      tags: [Tag.BUILDING],
      cost: 5,

      behavior: {
        production: {energy: -2, plants: 1},
        tr: 1,
      },

      metadata: {
        cardNumber: '171',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(2).br;
            pb.plus().plants(1);
          });
          b.tr(1);
        }),
        description: 'Decrease your energy production 2 steps and increase your plant production 1 step. Raise your TR 1 step.',
      },
    });
  }
}
