import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class SnowAlgae extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.SNOW_ALGAE,
      cost: 12,
      tags: [Tag.PLANT],

      behavior: {
        production: {plants: 1, heat: 1},
      },

      requirements: {oceans: 2},
      metadata: {
        cardNumber: '211',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.plants(1).heat(1);
          });
        }),
        description: 'Requires 2 oceans. Increase your plant production and your heat production 1 step each.',
      },
    });
  }
}
