import {Colony} from './Colony';
import {Resources} from '../../common/Resources';
import {ColonyName} from '../../common/colonies/ColonyName';
import {ColonyBenefit} from '../../common/colonies/ColonyBenefit';

export class Ganymede extends Colony {
  constructor() {
    super({
      name: ColonyName.GANYMEDE,
      buildType: ColonyBenefit.GAIN_PRODUCTION,
      buildResource: Resources.PLANTS,
      tradeType: ColonyBenefit.GAIN_RESOURCES,
      tradeQuantity: [0, 1, 2, 3, 4, 5, 6],
      tradeResource: Resources.PLANTS,
      colonyBonusType: ColonyBenefit.GAIN_RESOURCES,
      colonyBonusResource: Resources.PLANTS,
    });
  }
}
