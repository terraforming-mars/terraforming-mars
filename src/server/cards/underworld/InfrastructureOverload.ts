import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Tag} from '../../../common/cards/Tag';
import {all} from '../Options';
import {Resource} from '../../../common/Resource';

export class InfrastructureOverload extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.INFRASTRUCTURE_OVERLOAD,
      type: CardType.EVENT,
      cost: 3,
      tags: [Tag.POWER, Tag.CRIME],

      requirements: {corruption: 2},

      victoryPoints: -1,

      behavior: {
        decreaseAnyProduction: {count: 2, type: Resource.ENERGY},
      },

      metadata: {
        cardNumber: 'U68',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.text('-2').energy(1, {all}));
        }),
        description: 'Requires 2 corruption. Reduce any energy production 2 steps.',
      },
    });
  }
}
