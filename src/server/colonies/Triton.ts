import {Colony} from './Colony';
import {ColonyName} from '../../common/colonies/ColonyName';
import {ColonyBenefit} from '../../common/colonies/ColonyBenefit';
import {Resource} from '../../common/Resource';

export class Triton extends Colony {
  constructor() {
    super({
      name: ColonyName.TRITON,
      build: {
        description: 'Gain 3 titanium',
        type: ColonyBenefit.GAIN_RESOURCES,
        quantity: [3, 3, 3],
        resource: Resource.TITANIUM,
      },
      trade: {
        description: 'Gain n titanium',
        type: ColonyBenefit.GAIN_RESOURCES,
        quantity: [0, 1, 1, 2, 3, 4, 5],
        resource: Resource.TITANIUM,
      },
      colony: {
        description: 'Gain 1 titanium',
        type: ColonyBenefit.GAIN_RESOURCES,
        resource: Resource.TITANIUM,
      },
    });
  }
}
