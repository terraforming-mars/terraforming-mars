import {Colony} from './Colony';
import {Resource} from '../../common/Resource';
import {ColonyName} from '../../common/colonies/ColonyName';
import {ColonyBenefit} from '../../common/colonies/ColonyBenefit';

export class Ganymede extends Colony {
  constructor() {
    super({
      name: ColonyName.GANYMEDE,
      build: {
        description: 'Gain 1 plant production',
        type: ColonyBenefit.GAIN_PRODUCTION,
        resource: Resource.PLANTS,
      },
      trade: {
        description: 'Gain n plants',
        type: ColonyBenefit.GAIN_RESOURCES,
        quantity: [0, 1, 2, 3, 4, 5, 6],
        resource: Resource.PLANTS,
      },
      colony: {
        description: 'Gain 1 plant',
        type: ColonyBenefit.GAIN_RESOURCES,
        resource: Resource.PLANTS,
      },
    });
  }
}
