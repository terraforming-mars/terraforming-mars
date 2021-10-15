import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../Units';

export class MagneticFieldDome extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.MAGNETIC_FIELD_DOME,
      tags: [Tags.BUILDING],
      cost: 5,
      productionBox: Units.of({energy: -2, plants: 1}),
      tr: {tr: 1},

      metadata: {
        cardNumber: '171',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(2).br;
            pb.plus().plants(1);
          });
          b.tr(1);
        }),
        description: 'Decrease your Energy production 2 steps and increase your Plant production 1 step. Raise your TR 1 step.',
      },
    });
  }

  public canPlay(player: Player): boolean {
    return player.getProduction(Resources.ENERGY) >= 2;
  }

  public play(player: Player) {
    player.addProduction(Resources.ENERGY, -2);
    player.addProduction(Resources.PLANTS, 1);
    player.increaseTerraformRating();
    return undefined;
  }
}
