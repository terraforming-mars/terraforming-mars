import {Colony} from './Colony';
import {ColonyName} from '../../common/colonies/ColonyName';
import {ColonyBenefit} from '../../common/colonies/ColonyBenefit';
import {Resources} from '../../common/Resources';

export class Triton extends Colony {
  constructor() {
    super({
      name: ColonyName.TRITON,
      buildType: ColonyBenefit.GAIN_RESOURCES,
      buildQuantity: [3, 3, 3],
      buildResource: Resources.TITANIUM,
      tradeType: ColonyBenefit.GAIN_RESOURCES,
      tradeQuantity: [0, 1, 1, 2, 3, 4, 5],
      tradeResource: Resources.TITANIUM,
      colonyBonusType: ColonyBenefit.GAIN_RESOURCES,
      colonyBonusResource: Resources.TITANIUM,
    });
  }
}
