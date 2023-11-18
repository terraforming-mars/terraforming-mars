import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Tag} from '../../../common/cards/Tag';

export class GeothermalNetwork extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.GEOTHERMAL_NETWORK,
      tags: [Tag.MARS, Tag.BUILDING],
      cost: 14,

      requirements: {excavation: 3},

      behavior: {
        production: {heat: 3},
      },

      victoryPoints: 1,

      metadata: {
        cardNumber: 'U24',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.heat(3));
        }),
        description: 'Requires 3 excavation markers. Increase your heat production 3 steps.',
      },
    });
  }
}
