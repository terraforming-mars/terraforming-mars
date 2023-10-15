import {Colony} from '../../colonies/Colony';
import {ColonyName} from '../../../common/colonies/ColonyName';
import {ColonyBenefit} from '../../../common/colonies/ColonyBenefit';

export class Leavitt extends Colony {
  constructor() {
    super({
      description: [
        'Gain 1 science tag',
        'Draw n cards, keep 1',
        'Draw 1 card which you may pay to keep',
      ],

      name: ColonyName.LEAVITT,
      buildType: ColonyBenefit.GAIN_SCIENCE_TAG,
      tradeType: ColonyBenefit.DRAW_CARDS_AND_KEEP_ONE,
      tradeQuantity: [1, 2, 3, 4, 5, 6, 7],
      colonyBonusType: ColonyBenefit.DRAW_CARDS_AND_BUY_ONE,
    });
  }
}
