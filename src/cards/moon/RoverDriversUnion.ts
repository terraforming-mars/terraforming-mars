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
        description:
          'Requires 2 Logistic Rate. Raise the Logistic Rate 1 step. Increase your M€ production 1 step per Logistic Rate.',
        cardNumber: 'M78',
        renderData: CardRenderer.builder((b) => {
          b.moonLogisticsRate().br;
          b.production((pb) => pb.megacredits(1))
            .slash()
            .moonLogisticsRate();
        }),
      },
    });
  }

  public play(player: Player) {
    MoonExpansion.ifMoon(player.game, (moonData) => {
      MoonExpansion.raiseLogisticRate(player);
      player.addProduction(Resources.MEGACREDITS, moonData.logisticRate);
    });
    return undefined;
  }
}
