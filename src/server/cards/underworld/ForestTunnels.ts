import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Tag} from '../../../common/cards/Tag';

export class ForestTunnels extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.FOREST_TUNNELS,
      tags: [Tag.PLANT],
      cost: 7,

      behavior: {
        stock: {plants: {underworld: {undergroundTokens: {}}}},
      },

      metadata: {
        cardNumber: 'U016',
        renderData: CardRenderer.builder((b) => {
          b.plants(1).slash().undergroundResources(1);
        }),
        description: 'Gain 1 plant for each underground token you own.',
      },
    });
  }
}
