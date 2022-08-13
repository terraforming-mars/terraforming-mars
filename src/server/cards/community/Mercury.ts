import {Colony} from '../../colonies/Colony';
import {ColonyName} from '../../../common/colonies/ColonyName';
import {ColonyBenefit} from '../../../common/colonies/ColonyBenefit';
import {Resources} from '../../../common/Resources';
import {ShouldIncreaseTrack} from '../../../common/colonies/ShouldIncreaseTrack';

export class Mercury extends Colony {
  constructor() {
    super({
      name: ColonyName.MERCURY,
      buildType: ColonyBenefit.COPY_TRADE,
      tradeType: ColonyBenefit.GAIN_PRODUCTION,
      tradeResource: [
        Resources.HEAT, Resources.HEAT, Resources.HEAT,
        Resources.STEEL, Resources.STEEL,
        Resources.TITANIUM, Resources.TITANIUM,
      ],
      colonyBonusType: ColonyBenefit.GAIN_RESOURCES,
      colonyBonusResource: Resources.MEGACREDITS,
      colonyBonusQuantity: 2,
      shouldIncreaseTrack: ShouldIncreaseTrack.ASK,
    });
  }
}
