import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {Resources} from '../../common/Resources';
import {CardName} from '../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../common/Units';

export class TectonicStressPower extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.TECTONIC_STRESS_POWER,
      tags: [Tags.ENERGY, Tags.BUILDING],
      cost: 18,
      productionBox: Units.of({energy: 3}),
      victoryPoints: 1,

      requirements: CardRequirements.builder((b) => b.tag(Tags.SCIENCE, 2)),
      metadata: {
        cardNumber: '145',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.energy(3));
        }),
        description: 'Requires 2 Science tags. Increase your Energy production 3 steps.',
      },
    });
  }
  public play(player: Player) {
    player.addProduction(Resources.ENERGY, 3);
    return undefined;
  }
}
