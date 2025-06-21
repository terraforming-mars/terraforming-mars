import {Colony} from './Colony';
import {ColonyName} from '../../common/colonies/ColonyName';
import {ColonyBenefit} from '../../common/colonies/ColonyBenefit';
import {Resource} from '../../common/Resource';

export class Io extends Colony {
  constructor() {
    super({
      name: ColonyName.IO,
      description: {
        buildBonus: 'Gain 1 heat production',
        tradeBonus: 'Gain n heat',
        colonyBonus: 'Gain 2 heat',
      },

      buildType: ColonyBenefit.GAIN_PRODUCTION,
      buildResource: Resource.HEAT,
      tradeType: ColonyBenefit.GAIN_RESOURCES,
      tradeQuantity: [2, 3, 4, 6, 8, 10, 13],
      tradeResource: Resource.HEAT,
      colonyBonusType: ColonyBenefit.GAIN_RESOURCES,
      colonyBonusQuantity: 2,
      colonyBonusResource: Resource.HEAT,
    });
  }
}
