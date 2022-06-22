import {Colony} from '../../colonies/Colony';
import {ColonyName} from '../../common/colonies/ColonyName';
import {ColonyBenefit} from '../../common/colonies/ColonyBenefit';

export class Pallas extends Colony {
  constructor() {
    super({
      name: ColonyName.PALLAS,
      buildType: ColonyBenefit.GAIN_INFLUENCE,
      tradeType: ColonyBenefit.PLACE_DELEGATES,
      tradeQuantity: [1, 1, 1, 2, 2, 2, 3],
      colonyBonusType: ColonyBenefit.GIVE_MC_PER_DELEGATE,
    });
  }
}
