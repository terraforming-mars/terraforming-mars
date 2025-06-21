import {Colony} from './Colony';
import {Resource} from '../../common/Resource';
import {ColonyName} from '../../common/colonies/ColonyName';
import {ColonyBenefit} from '../../common/colonies/ColonyBenefit';

export class Callisto extends Colony {
  constructor() {
    super({
      name: ColonyName.CALLISTO,
      description: {
        buildBonus: 'Gain 1 energy production',
        tradeBonus: 'Gain n energy',
        colonyBonus: 'Gain 3 energy',
      },

      buildType: ColonyBenefit.GAIN_PRODUCTION,
      buildResource: Resource.ENERGY,
      tradeType: ColonyBenefit.GAIN_RESOURCES,
      tradeQuantity: [0, 2, 3, 5, 7, 10, 13],
      tradeResource: Resource.ENERGY,
      colonyBonusType: ColonyBenefit.GAIN_RESOURCES,
      colonyBonusQuantity: 3,
      colonyBonusResource: Resource.ENERGY,
    });
  }
}
