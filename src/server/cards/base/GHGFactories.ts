import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {digit} from '../Options';

export class GHGFactories extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.GHG_FACTORIES,
      tags: [Tag.BUILDING],
      cost: 11,

      behavior: {
        production: {energy: -1, heat: 4},
      },

      metadata: {
        cardNumber: '126',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(1).br;
            pb.plus().heat(4, {digit});
          });
        }),
        description: 'Decrease your energy production 1 step and increase your heat production 4 steps.',
      },
    });
  }
}
