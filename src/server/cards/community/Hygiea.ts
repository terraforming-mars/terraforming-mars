import {Colony} from '../../colonies/Colony';
import {ColonyName} from '../../../common/colonies/ColonyName';
import {ColonyBenefit} from '../../../common/colonies/ColonyBenefit';
import {Resources} from '../../../common/Resources';
import {ShouldIncreaseTrack} from '../../../common/colonies/ShouldIncreaseTrack';

export class Hygiea extends Colony {
  constructor() {
    super({
      name: ColonyName.HYGIEA,
      buildType: ColonyBenefit.OPPONENT_DISCARD,
      tradeType: ColonyBenefit.STEAL_RESOURCES,
      tradeQuantity: [3, 3, 3, 3, 3, 3, 3],
      tradeResource: [
        Resources.MEGACREDITS,
        Resources.MEGACREDITS,
        Resources.HEAT,
        Resources.ENERGY,
        Resources.PLANTS,
        Resources.STEEL,
        Resources.TITANIUM,
      ],
      colonyBonusType: ColonyBenefit.GAIN_RESOURCES,
      colonyBonusQuantity: 3,
      colonyBonusResource: Resources.MEGACREDITS,
      shouldIncreaseTrack: ShouldIncreaseTrack.ASK,
    });
  }
}
