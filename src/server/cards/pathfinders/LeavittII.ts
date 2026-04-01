import {Colony} from '../../colonies/Colony';
import {ColonyName} from '../../../common/colonies/ColonyName';
import {Resource} from '../../../common/Resource';
import {ColonyBenefit} from '../../../common/colonies/ColonyBenefit';

export class LeavittII extends Colony {
  constructor() {
    super({
      name: ColonyName.LEAVITT_II,
      build: {
        description: 'Gain 2 science tags and 1 clone tag',
        type: ColonyBenefit.GAIN_SCIENCE_TAGS_AND_CLONE_TAG,
      },
      trade: {
        description: 'Raise any planetary track n steps',
        type: ColonyBenefit.RAISE_PLANETARY_TRACK,
        quantity: [0, 1, 1, 2, 2, 3, 4],
      },
      colony: {
        description: 'Gain 2 M€',
        type: ColonyBenefit.GAIN_RESOURCES,
        quantity: 2,
        resource: Resource.MEGACREDITS,
      },
      expansion: 'pathfinders',
    });
  }
}
