import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';
import {Units} from '../../Units';
import {MoonCard} from './MoonCard';

export class LunaStagingStation extends MoonCard {
  constructor() {
    super({
      name: CardName.LUNA_STAGING_STATION,
      cardType: CardType.AUTOMATED,
      tags: [Tags.MOON, Tags.BUILDING],
      cost: 12,

      requirements: CardRequirements.builder((b) => b.logisticRate(2)),
      metadata: {
        description: 'Requires Logistic Rate to be 2 or higher. Spend 1 titanium. Raise Logistic Rate 2 steps.',
        cardNumber: 'M30',
        renderData: CardRenderer.builder((b) => {
          b.minus().titanium(1).br;
          b.moonLogisticsRate(2);
        }),
      },
    }, {
      reserveUnits: Units.of({titanium: 1}),
    });
  };

  public canPlay(player: Player): boolean {
    return MoonExpansion.moonData(player.game).logisticRate >= 2;
  }

  public play(player: Player) {
    super.play(player);
    MoonExpansion.raiseLogisticRate(player);
    MoonExpansion.raiseLogisticRate(player);
    return undefined;
  }
}
