import {ColonyBenefit} from '../../common/colonies/ColonyBenefit';
import {ColonyName} from '../../common/colonies/ColonyName';
import {Colony} from './Colony';

export class Deimos extends Colony {
  constructor() {
    super({
      name: ColonyName.DEIMOS,
      build: {
        description: 'Place a hazard tile next to no other tile',
        type: ColonyBenefit.PLACE_HAZARD_TILE,
        quantity: [3, 3, 3],
      },
      trade: {
        description: 'Erode n spaces adjacent to hazard tiles (gaining placement bonuses)',
        type: ColonyBenefit.ERODE_SPACES_ADJACENT_TO_HAZARDS,
        quantity: [0, 0, 1, 1, 2, 2, 3],
      },
      colony: {
        description: 'Gain 1 M€ per hazard tile on Mars',
        type: ColonyBenefit.GAIN_MC_PER_HAZARD_TILE,
      },
      expansion: 'ares',
    });
  }
}
