import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class LakeMarineris extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.LAKE_MARINERIS,
      cost: 18,
      requirements: {temperature: 0},
      victoryPoints: 2,

      behavior: {
        ocean: {count: 2},
      },

      metadata: {
        cardNumber: '053',
        renderData: CardRenderer.builder((b) => b.oceans(2)),
        description: 'Requires 0° C or warmer. Place 2 ocean tiles.',
      },
    });
  }
}
