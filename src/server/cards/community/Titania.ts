import {Colony} from '../../colonies/Colony';
import {Resource} from '../../../common/Resource';
import {ColonyName} from '../../../common/colonies/ColonyName';
import {ColonyBenefit} from '../../../common/colonies/ColonyBenefit';

export class Titania extends Colony {
  constructor() {
    super({
      name: ColonyName.TITANIA,
      description: {
        buildBonus: 'Gain 5, 3, or 2 VP',
        tradeBonus: 'Gain n VP',
        colonyBonus: 'Lose 3 M€',
      },


      buildType: ColonyBenefit.GAIN_VP,
      buildQuantity: [5, 3, 2],
      tradeType: ColonyBenefit.GAIN_VP,
      tradeQuantity: [2, 2, 2, 1, 1, 0, 0],
      colonyBonusType: ColonyBenefit.LOSE_RESOURCES,
      colonyBonusQuantity: 3,
      colonyBonusResource: Resource.MEGACREDITS,
      shouldIncreaseTrack: 'no',
    });
  }
}
