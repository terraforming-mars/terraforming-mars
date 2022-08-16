import {Colony} from '../../colonies/Colony';
import {ColonyName} from '../../../common/colonies/ColonyName';
import {ColonyBenefit} from '../../../common/colonies/ColonyBenefit';

export class Iapetus extends Colony {
  constructor() {
    super({
      name: ColonyName.IAPETUS,
      buildType: ColonyBenefit.GAIN_TR,
      tradeType: ColonyBenefit.GAIN_TR,
      tradeQuantity: [0, 0, 0, 1, 1, 1, 2],
      colonyBonusType: ColonyBenefit.GAIN_CARD_DISCOUNT,
    });
  }
}
