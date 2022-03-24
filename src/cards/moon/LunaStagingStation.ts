import {CardName} from '../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../common/cards/CardType';
import {Tags} from '../../common/cards/Tags';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';
import {Units} from '../../common/Units';
import {MoonCard} from './MoonCard';

export class LunaStagingStation extends MoonCard {
  constructor() {
    super({
      name: CardName.LUNA_STAGING_STATION,
      cardType: CardType.AUTOMATED,
      tags: [Tags.MOON, Tags.BUILDING],
      cost: 12,
      reserveUnits: Units.of({titanium: 1}),
      tr: {moonLogistics: 2},

      requirements: CardRequirements.builder((b) => b.logisticRate(2)),
      metadata: {
        description: 'Requires Logistic Rate to be 2 or higher. Spend 1 titanium. Raise the Logistic Rate 2 steps.',
        cardNumber: 'M30',
        renderData: CardRenderer.builder((b) => {
          b.minus().titanium(1).br;
          b.moonLogisticsRate({amount: 2});
        }),
      },
    });
  }

  public override play(player: Player) {
    super.play(player);
    MoonExpansion.raiseLogisticRate(player, 2);
    return undefined;
  }
}
