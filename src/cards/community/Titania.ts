import {Colony} from '../../colonies/Colony';
import {Resources} from '../../common/Resources';
import {ColonyName} from '../../common/colonies/ColonyName';
import {ColonyBenefit} from '../../common/colonies/ColonyBenefit';
import {ShouldIncreaseTrack} from '../../common/colonies/ShouldIncreaseTrack';

export class Titania extends Colony {
  constructor() {
    super({
      name: ColonyName.TITANIA,
      buildType: ColonyBenefit.GAIN_VP,
      buildQuantity: [5, 3, 2],
      tradeType: ColonyBenefit.GAIN_VP,
      tradeQuantity: [2, 2, 2, 1, 1, 0, 0],
      colonyBonusType: ColonyBenefit.LOSE_RESOURCES,
      colonyBonusQuantity: 3,
      colonyBonusResource: Resources.MEGACREDITS,
      shouldIncreaseTrack: ShouldIncreaseTrack.NO,
    });
  }
}
