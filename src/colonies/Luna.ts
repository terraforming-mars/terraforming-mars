import {Colony} from './Colony';
import {ColonyName} from '../common/colonies/ColonyName';
import {ColonyBenefit} from '../common/colonies/ColonyBenefit';
import {Resources} from '../common/Resources';

export class Luna extends Colony {
  constructor() {
    super({
      name: ColonyName.LUNA,
      buildType: ColonyBenefit.GAIN_PRODUCTION,
      buildQuantity: [2, 2, 2],
      buildResource: Resources.MEGACREDITS,
      tradeType: ColonyBenefit.GAIN_RESOURCES,
      tradeQuantity: [1, 2, 4, 7, 10, 13, 17],
      tradeResource: Resources.MEGACREDITS,
      colonyBonusType: ColonyBenefit.GAIN_RESOURCES,
      colonyBonusQuantity: 2,
      colonyBonusResource: Resources.MEGACREDITS,
    });
  }
}
