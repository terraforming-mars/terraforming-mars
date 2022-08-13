import {Colony} from './Colony';
import {ColonyName} from '../../common/colonies/ColonyName';
import {ColonyBenefit} from '../../common/colonies/ColonyBenefit';
import {Resources} from '../../common/Resources';

export class Io extends Colony {
  constructor() {
    super({
      name: ColonyName.IO,
      buildType: ColonyBenefit.GAIN_PRODUCTION,
      buildResource: Resources.HEAT,
      tradeType: ColonyBenefit.GAIN_RESOURCES,
      tradeQuantity: [2, 3, 4, 6, 8, 10, 13],
      tradeResource: Resources.HEAT,
      colonyBonusType: ColonyBenefit.GAIN_RESOURCES,
      colonyBonusQuantity: 2,
      colonyBonusResource: Resources.HEAT,
    });
  }
}
