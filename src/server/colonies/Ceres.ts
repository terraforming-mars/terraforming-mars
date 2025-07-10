import {Colony} from './Colony';
import {ColonyName} from '../../common/colonies/ColonyName';
import {ColonyBenefit} from '../../common/colonies/ColonyBenefit';
import {Resource} from '../../common/Resource';

export class Ceres extends Colony {
  constructor() {
    super({
      name: ColonyName.CERES,
      build: {
        description: 'Gain 1 steel production',
        type: ColonyBenefit.GAIN_PRODUCTION,
        resource: Resource.STEEL,
      },
      trade: {
        description: 'Gain n steel',
        type: ColonyBenefit.GAIN_RESOURCES,
        quantity: [1, 2, 3, 4, 6, 8, 10],
        resource: Resource.STEEL,
      },
      colony: {
        description: 'Gain 2 steel',
        type: ColonyBenefit.GAIN_RESOURCES,
        quantity: 2,
        resource: Resource.STEEL,
      },
    });
  }
}
