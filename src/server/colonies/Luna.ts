import {Colony} from './Colony';
import {ColonyName} from '../../common/colonies/ColonyName';
import {ColonyBenefit} from '../../common/colonies/ColonyBenefit';
import {Resource} from '../../common/Resource';

export class Luna extends Colony {
  constructor() {
    super({
      name: ColonyName.LUNA,
      description: {
        buildBonus: 'Gain 2 M€ production',
        tradeBonus: 'Gain n M€',
        colonyBonus: 'Gain 2 M€',
      },
      buildType: ColonyBenefit.GAIN_PRODUCTION,
      buildQuantity: [2, 2, 2],
      buildResource: Resource.MEGACREDITS,
      tradeType: ColonyBenefit.GAIN_RESOURCES,
      tradeQuantity: [1, 2, 4, 7, 10, 13, 17],
      tradeResource: Resource.MEGACREDITS,
      colonyBonusType: ColonyBenefit.GAIN_RESOURCES,
      colonyBonusQuantity: 2,
      colonyBonusResource: Resource.MEGACREDITS,
    });
  }
}
