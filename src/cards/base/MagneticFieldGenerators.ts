import {Player} from '../../Player';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {Resources} from '../../common/Resources';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../common/Units';
import {digit} from '../Options';

export class MagneticFieldGenerators extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.MAGNETIC_FIELD_GENERATORS,
      tags: [Tags.BUILDING],
      cost: 20,
      productionBox: Units.of({energy: -4, plants: 2}),
      tr: {tr: 3},

      metadata: {
        cardNumber: '165',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(4, {digit}).br;
            pb.plus().plants(2);
          }).br;
          b.tr(3);
        }),
        description: 'Decrease your Energy production 4 steps and increase your Plant production 2 steps. Raise your TR 3 steps.',
      },
    });
  }

  public override canPlay(player: Player): boolean {
    return player.getProduction(Resources.ENERGY) >= 4;
  }

  public play(player: Player) {
    player.addProduction(Resources.ENERGY, -4);
    player.addProduction(Resources.PLANTS, 2);
    player.increaseTerraformRatingSteps(3);
    return undefined;
  }
}
