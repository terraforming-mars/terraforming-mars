import {Colony} from '../../colonies/Colony';
import {Resource} from '../../../common/Resource';
import {ColonyName} from '../../../common/colonies/ColonyName';
import {ColonyBenefit} from '../../../common/colonies/ColonyBenefit';

export class Titania extends Colony {
  constructor() {
    super({
      name: ColonyName.TITANIA,
      build: {
        description: 'Gain 5, 3, or 2 VP',
        type: ColonyBenefit.GAIN_VP,
        quantity: [5, 3, 2],
      },
      trade: {
        description: 'Gain n VP',
        type: ColonyBenefit.GAIN_VP,
        quantity: [2, 2, 2, 1, 1, 0, 0],
      },
      colony: {
        description: 'Lose 3 M€',
        type: ColonyBenefit.LOSE_RESOURCES,
        quantity: 3,
        resource: Resource.MEGACREDITS,
      },
      shouldIncreaseTrack: 'no',
    });
  }
}
