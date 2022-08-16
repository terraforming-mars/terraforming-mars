import {Colony} from '../../colonies/Colony';
import {ColonyName} from '../../../common/colonies/ColonyName';
import {ColonyBenefit} from '../../../common/colonies/ColonyBenefit';

export class Leavitt extends Colony {
  constructor() {
    super({
      name: ColonyName.LEAVITT,
      buildType: ColonyBenefit.GAIN_SCIENCE_TAG,
      tradeType: ColonyBenefit.DRAW_CARDS_AND_KEEP_ONE,
      tradeQuantity: [1, 2, 3, 4, 5, 6, 7],
      colonyBonusType: ColonyBenefit.DRAW_CARDS_AND_BUY_ONE,
    });
  }
}
