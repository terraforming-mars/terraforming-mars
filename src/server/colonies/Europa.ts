import {Colony} from './Colony';
import {Resource} from '../../common/Resource';
import {ColonyName} from '../../common/colonies/ColonyName';
import {ColonyBenefit} from '../../common/colonies/ColonyBenefit';

export class Europa extends Colony {
  constructor() {
    super({
      name: ColonyName.EUROPA,
      build: {
        description: 'Place an ocean tile',
        type: ColonyBenefit.PLACE_OCEAN_TILE,
      },
      trade: {
        description: 'Gain 1 unit of production of the type under the track marker',
        type: ColonyBenefit.GAIN_PRODUCTION,
        resource: [
          Resource.MEGACREDITS, Resource.MEGACREDITS,
          Resource.ENERGY, Resource.ENERGY,
          Resource.PLANTS, Resource.PLANTS, Resource.PLANTS,
        ],
      },
      colony: {
        description: 'Gain 1 M€',
        type: ColonyBenefit.GAIN_RESOURCES,
        resource: Resource.MEGACREDITS,
      },
      shouldIncreaseTrack: 'ask',
    });
  }
}
