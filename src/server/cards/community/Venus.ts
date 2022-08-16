import {Colony} from '../../colonies/Colony';
import {ColonyName} from '../../../common/colonies/ColonyName';
import {ColonyBenefit} from '../../../common/colonies/ColonyBenefit';

export class Venus extends Colony {
  public override isActive = false;
  constructor() {
    super({
      name: ColonyName.VENUS,
      buildType: ColonyBenefit.INCREASE_VENUS_SCALE,
      tradeType: ColonyBenefit.ADD_RESOURCES_TO_VENUS_CARD,
      tradeQuantity: [0, 0, 0, 1, 2, 3, 4],
      colonyBonusType: ColonyBenefit.ADD_RESOURCES_TO_VENUS_CARD,
    });
  }
}
