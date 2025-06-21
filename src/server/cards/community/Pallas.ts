import {Colony} from '../../colonies/Colony';
import {ColonyName} from '../../../common/colonies/ColonyName';
import {ColonyBenefit} from '../../../common/colonies/ColonyBenefit';

export class Pallas extends Colony {
  constructor() {
    super({
      name: ColonyName.PALLAS,
      description: {
        buildBonus: 'Gain +1 influence',
        tradeBonus: 'Place n delegates',
        colonyBonus: 'Gain 1 M€ for each delegate in any party',
      },

      buildType: ColonyBenefit.GAIN_INFLUENCE,
      tradeType: ColonyBenefit.PLACE_DELEGATES,
      tradeQuantity: [1, 1, 1, 2, 2, 2, 3],
      colonyBonusType: ColonyBenefit.GIVE_MC_PER_DELEGATE,
    });
  }
}
