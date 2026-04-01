import {Colony} from '../../colonies/Colony';
import {ColonyName} from '../../../common/colonies/ColonyName';
import {ColonyBenefit} from '../../../common/colonies/ColonyBenefit';

export class Pallas extends Colony {
  constructor() {
    super({
      name: ColonyName.PALLAS,
      build: {
        description: 'Gain +1 influence',
        type: ColonyBenefit.GAIN_INFLUENCE,
      },
      trade: {
        description: 'Place n delegates',
        type: ColonyBenefit.PLACE_DELEGATES,
        quantity: [1, 1, 1, 2, 2, 2, 3],
      },
      colony: {
        description: 'Gain 1 M€ for each delegate in any party',
        type: ColonyBenefit.GIVE_MC_PER_DELEGATE,
      },
      expansion: 'turmoil',
    });
  }
}
