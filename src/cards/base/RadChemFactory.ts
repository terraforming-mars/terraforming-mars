import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {Resources} from '../../common/Resources';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../common/Units';

export class RadChemFactory extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.RAD_CHEM_FACTORY,
      tags: [Tags.BUILDING],
      cost: 8,
      productionBox: Units.of({energy: -1}),
      tr: {tr: 2},

      metadata: {
        cardNumber: '205',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.minus().energy(1)).br;
          b.tr(2);
        }),
        description: 'Decrease your Energy production 1 step. Raise your TR 2 steps.',
      },
    });
  }
  public override canPlay(player: Player): boolean {
    return player.getProduction(Resources.ENERGY) >= 1;
  }

  public play(player: Player) {
    player.addProduction(Resources.ENERGY, -1);
    player.increaseTerraformRatingSteps(2);
    return undefined;
  }
}
