import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class FusionPower extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.FUSION_POWER,
      tags: [Tag.SCIENCE, Tag.POWER, Tag.BUILDING],
      cost: 14,

      behavior: {
        production: {energy: 3},
      },

      requirements: CardRequirements.builder((b) => b.tag(Tag.POWER, 2)),
      metadata: {
        cardNumber: '132',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.energy(3));
        }),
        description: 'Requires 2 power tags. Increase your energy production 3 steps.',
      },
    });
  }
}

