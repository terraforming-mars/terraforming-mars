import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardRenderer} from '../render/CardRenderer';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {Resources} from '../../Resources';
import {Card} from '../Card';
import {CardRequirements} from '../CardRequirements';

export class RoverDriversUnion extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.ROVER_DRIVERS_UNION,
      cardType: CardType.AUTOMATED,
      tags: [Tags.MOON],
      cost: 16,
      requirements: CardRequirements.builder((b) => b.logisticRate(2)),

      metadata: {
        description: 'Requires 2 Logistic Rate. Raise Logistic Rate 1 step. Increase your MC production 1 step per each Logistic Rate.',
        cardNumber: 'M78',
        renderData: CardRenderer.builder((b) => {
          b.moonLogisticsRate(1).br;
          b.production((pb) => pb.megacredits(1)).slash().moonLogisticsRate(1);
        }),
      },
    });
  };

  public canPlay(player: Player): boolean {
    return MoonExpansion.moonData(player.game).logisticRate >= 2;
  }

  public play(player: Player) {
    MoonExpansion.ifMoon(player.game, (moonData) => {
      MoonExpansion.raiseLogisticRate(player);
      player.addProduction(Resources.MEGACREDITS, moonData.logisticRate);
    });
    return undefined;
  }
}
