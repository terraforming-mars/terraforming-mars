import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {Resources} from '../../../common/Resources';
import {CardName} from '../../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../../common/Units';

export class FusionPower extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.FUSION_POWER,
      tags: [Tag.SCIENCE, Tag.ENERGY, Tag.BUILDING],
      cost: 14,
      productionBox: Units.of({energy: 3}),

      requirements: CardRequirements.builder((b) => b.tag(Tag.ENERGY, 2)),
      metadata: {
        cardNumber: '132',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.energy(3));
        }),
        description: 'Requires 2 Power tags. Increase your Energy production 3 steps.',
      },
    });
  }

  public play(player: Player) {
    player.addProduction(Resources.ENERGY, 3);
    return undefined;
  }
}

