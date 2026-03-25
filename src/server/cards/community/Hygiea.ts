import {Colony} from '../../colonies/Colony';
import {ColonyName} from '../../../common/colonies/ColonyName';
import {ColonyBenefit} from '../../../common/colonies/ColonyBenefit';
import {Resource} from '../../../common/Resource';

export class Hygiea extends Colony {
  constructor() {
    super({
      name: ColonyName.HYGIEA,
      build: {
        description: 'Choose opponent to discard 1 card',
        type: ColonyBenefit.OPPONENT_DISCARD,
      },
      trade: {
        description: 'Steal 3 units of the listed type',
        type: ColonyBenefit.STEAL_RESOURCES,
        quantity: [3, 3, 3, 3, 3, 3, 3],
        resource: [
          Resource.MEGACREDITS,
          Resource.MEGACREDITS,
          Resource.HEAT,
          Resource.ENERGY,
          Resource.PLANTS,
          Resource.STEEL,
          Resource.TITANIUM,
        ],
      },
      colony: {
        description: 'Gain 3 M€',
        type: ColonyBenefit.GAIN_RESOURCES,
        quantity: 3,
        resource: Resource.MEGACREDITS,
      },
      shouldIncreaseTrack: 'ask',
    });
  }
}
