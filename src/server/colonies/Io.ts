import {Colony} from './Colony';
import {ColonyName} from '../../common/colonies/ColonyName';
import {ColonyBenefit} from '../../common/colonies/ColonyBenefit';
import {Resource} from '../../common/Resource';

export class Io extends Colony {
  constructor() {
    super({
      name: ColonyName.IO,
      build: {
        description: 'Gain 1 heat production',
        type: ColonyBenefit.GAIN_PRODUCTION,
        resource: Resource.HEAT,
      },
      trade: {
        description: 'Gain n heat',
        type: ColonyBenefit.GAIN_RESOURCES,
        quantity: [2, 3, 4, 6, 8, 10, 13],
        resource: Resource.HEAT,
      },
      colony: {
        description: 'Gain 2 heat',
        type: ColonyBenefit.GAIN_RESOURCES,
        quantity: 2,
        resource: Resource.HEAT,
      },
    });
  }
}
