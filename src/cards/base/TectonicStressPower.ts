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

export class TectonicStressPower extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.TECTONIC_STRESS_POWER,
      tags: [Tags.ENERGY, Tags.BUILDING],
      cost: 18,
      productionBox: Units.of({energy: 3}),

      requirements: CardRequirements.builder((b) => b.tag(Tags.SCIENCE, 2)),
      metadata: {
        cardNumber: '145',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.energy(3));
        }),
        description: 'Requires 2 Science tags. Increase your Energy production 3 steps.',
        victoryPoints: 1,
      },
    });
  }
  public canPlay(player: Player): boolean {
    return player.getTagCount(Tags.SCIENCE) >= 2;
  }
  public play(player: Player) {
    if (player.getTagCount(Tags.SCIENCE) < 2) {
      throw 'Requires 2 science tags';
    }
    player.addProduction(Resources.ENERGY, 3);
    return undefined;
  }
  public getVictoryPoints() {
    return 1;
  }
}
