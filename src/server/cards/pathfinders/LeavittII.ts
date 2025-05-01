import {Colony} from '../../colonies/Colony';
import {ColonyName} from '../../../common/colonies/ColonyName';
import {Resource} from '../../../common/Resource';
import {ColonyBenefit} from '../../../common/colonies/ColonyBenefit';

export class LeavittII extends Colony {
  constructor() {
    super({
      name: ColonyName.LEAVITT_II,
      description: {
        buildBonus: 'Gain 2 science tags and 1 clone tag',
        colonyBonus: 'Raise any planetary track n steps',
        tradeBonus: 'Gain 2 M€',
      },

      buildType: ColonyBenefit.GAIN_SCIENCE_TAGS_AND_CLONE_TAG,

      tradeType: ColonyBenefit.RAISE_PLANETARY_TRACK,
      tradeQuantity: [0, 1, 1, 2, 2, 3, 4],
      colonyBonusType: ColonyBenefit.GAIN_RESOURCES,
      colonyBonusQuantity: 2,
      colonyBonusResource: Resource.MEGACREDITS,
    });
  }
}
