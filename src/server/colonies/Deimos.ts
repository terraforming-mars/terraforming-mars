import {ColonyBenefit} from '../../common/colonies/ColonyBenefit';
import {ColonyName} from '../../common/colonies/ColonyName';
import {Colony} from './Colony';

export class Deimos extends Colony {
  constructor() {
    super({
      description: [
        'Place a hazard tile next to no other tile',
        'Erode n spaces adjacent to hazard tiles',
        'Gain 1 M€ per hazard tile on Mars',
      ],
      //  public description = 'Hazards';
      name: ColonyName.DEIMOS,
      buildType: ColonyBenefit.PLACE_HAZARD_TILE,
      buildQuantity: [3, 3, 3],
      tradeType: ColonyBenefit.ERODE_SPACES_ADJACENT_TO_HAZARDS,
      tradeQuantity: [0, 0, 1, 1, 2, 2, 3],
      colonyBonusType: ColonyBenefit.GAIN_MC_PER_HAZARD_TILE,
    });
  }
}
