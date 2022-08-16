import {Colony} from './Colony';
import {Resources} from '../../common/Resources';
import {ColonyName} from '../../common/colonies/ColonyName';
import {ColonyBenefit} from '../../common/colonies/ColonyBenefit';

export class Callisto extends Colony {
  constructor() {
    super({
      name: ColonyName.CALLISTO,
      buildType: ColonyBenefit.GAIN_PRODUCTION,
      buildResource: Resources.ENERGY,
      tradeType: ColonyBenefit.GAIN_RESOURCES,
      tradeQuantity: [0, 2, 3, 5, 7, 10, 13],
      tradeResource: Resources.ENERGY,
      colonyBonusType: ColonyBenefit.GAIN_RESOURCES,
      colonyBonusQuantity: 3,
      colonyBonusResource: Resources.ENERGY,
    });
  }
}
