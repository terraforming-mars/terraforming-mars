import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../Units';

export class FusionPower extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.FUSION_POWER,
      tags: [Tags.SCIENCE, Tags.ENERGY, Tags.BUILDING],
      cost: 14,
      productionBox: Units.of({energy: 3}),

      requirements: CardRequirements.builder((b) => b.tag(Tags.ENERGY, 2)),
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

