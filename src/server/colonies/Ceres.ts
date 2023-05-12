import {Colony} from './Colony';
import {ColonyName} from '../../common/colonies/ColonyName';
import {ColonyBenefit} from '../../common/colonies/ColonyBenefit';
import {Resource} from '../../common/Resource';

export class Ceres extends Colony {
  constructor() {
    super({
      name: ColonyName.CERES,
      buildType: ColonyBenefit.GAIN_PRODUCTION,
      buildResource: Resource.STEEL,
      tradeType: ColonyBenefit.GAIN_RESOURCES,
      tradeQuantity: [1, 2, 3, 4, 6, 8, 10],
      tradeResource: Resource.STEEL,
      colonyBonusType: ColonyBenefit.GAIN_RESOURCES,
      colonyBonusQuantity: 2,
      colonyBonusResource: Resource.STEEL,
    });
  }
}
