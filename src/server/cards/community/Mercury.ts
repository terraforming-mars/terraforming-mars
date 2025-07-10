import {Colony} from '../../colonies/Colony';
import {ColonyName} from '../../../common/colonies/ColonyName';
import {ColonyBenefit} from '../../../common/colonies/ColonyBenefit';
import {Resource} from '../../../common/Resource';

export class Mercury extends Colony {
  constructor() {
    super({
      name: ColonyName.MERCURY,
      build: {
        description: 'Gain the trade bonus of any colony tile. (This does not move the markers.)',
        type: ColonyBenefit.COPY_TRADE,
      },
      trade: {
        description: 'Gain 1 unit of production of the type below the track marker',
        type: ColonyBenefit.GAIN_PRODUCTION,
        resource: [
          Resource.HEAT, Resource.HEAT, Resource.HEAT,
          Resource.STEEL, Resource.STEEL,
          Resource.TITANIUM, Resource.TITANIUM,
        ],
      },
      colony: {
        description: 'Gain 2 M€',
        type: ColonyBenefit.GAIN_RESOURCES,
        quantity: 2,
        resource: Resource.MEGACREDITS,
      },
      shouldIncreaseTrack: 'ask',
    });
  }
}
