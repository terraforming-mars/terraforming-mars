import {Colony} from './Colony';
import {ColonyName} from '../../common/colonies/ColonyName';
import {ColonyBenefit} from '../../common/colonies/ColonyBenefit';
import {Resource} from '../../common/Resource';

export class Triton extends Colony {
  constructor() {
    super({
      name: ColonyName.TRITON,
      description: {
        buildBonus: 'Gain 3 titanium',
        tradeBonus: 'Gain n titanium',
        colonyBonus: 'Gain 1 titanium',
      },

      buildType: ColonyBenefit.GAIN_RESOURCES,
      buildQuantity: [3, 3, 3],
      buildResource: Resource.TITANIUM,
      tradeType: ColonyBenefit.GAIN_RESOURCES,
      tradeQuantity: [0, 1, 1, 2, 3, 4, 5],
      tradeResource: Resource.TITANIUM,
      colonyBonusType: ColonyBenefit.GAIN_RESOURCES,
      colonyBonusResource: Resource.TITANIUM,
    });
  }
}
