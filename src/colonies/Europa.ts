import {Colony} from './Colony';
import {Resources} from '../common/Resources';
import {ColonyName} from '../common/colonies/ColonyName';
import {ColonyBenefit} from '../common/colonies/ColonyBenefit';
import {ShouldIncreaseTrack} from '../common/colonies/ShouldIncreaseTrack';

export class Europa extends Colony {
  constructor() {
    super({
      name: ColonyName.EUROPA,
      buildType: ColonyBenefit.PLACE_OCEAN_TILE,
      tradeType: ColonyBenefit.GAIN_PRODUCTION,
      tradeResource: [
        Resources.MEGACREDITS, Resources.MEGACREDITS,
        Resources.ENERGY, Resources.ENERGY,
        Resources.PLANTS, Resources.PLANTS, Resources.PLANTS,
      ],
      colonyBonusType: ColonyBenefit.GAIN_RESOURCES,
      colonyBonusResource: Resources.MEGACREDITS,
      shouldIncreaseTrack: ShouldIncreaseTrack.ASK,
    });
  }
}
