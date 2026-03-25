import {Colony} from './Colony';
import {Resource} from '../../common/Resource';
import {ColonyName} from '../../common/colonies/ColonyName';
import {ColonyBenefit} from '../../common/colonies/ColonyBenefit';

export class Callisto extends Colony {
  constructor() {
    super({
      name: ColonyName.CALLISTO,
      build: {
        description: 'Gain 1 energy production',
        type: ColonyBenefit.GAIN_PRODUCTION,
        resource: Resource.ENERGY,
      },
      trade: {
        description: 'Gain n energy',
        type: ColonyBenefit.GAIN_RESOURCES,
        quantity: [0, 2, 3, 5, 7, 10, 13],
        resource: Resource.ENERGY,
      },
      colony: {
        description: 'Gain 3 energy',
        type: ColonyBenefit.GAIN_RESOURCES,
        quantity: 3,
        resource: Resource.ENERGY,
      },
    });
  }
}
