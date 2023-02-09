import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class BlackPolarDust extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.BLACK_POLAR_DUST,
      cost: 15,

      behavior: {
        ocean: {},
        production: {megacredits: -2, heat: 3},
      },

      metadata: {
        cardNumber: '022',
        description: 'Place an ocean tile. Decrease your M€ production 2 steps and increase your heat production 3 steps.',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().megacredits(2).br;
            pb.plus().heat(3);
          }).oceans(1);
        }),
      },
    });
  }
}
