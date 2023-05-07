import {Colony} from '../../colonies/Colony';
import {ColonyName} from '../../../common/colonies/ColonyName';
import {ColonyBenefit} from '../../../common/colonies/ColonyBenefit';
import {Resource} from '../../../common/Resource';

export class Hygiea extends Colony {
  constructor() {
    super({
      name: ColonyName.HYGIEA,
      buildType: ColonyBenefit.OPPONENT_DISCARD,
      tradeType: ColonyBenefit.STEAL_RESOURCES,
      tradeQuantity: [3, 3, 3, 3, 3, 3, 3],
      tradeResource: [
        Resource.MEGACREDITS,
        Resource.MEGACREDITS,
        Resource.HEAT,
        Resource.ENERGY,
        Resource.PLANTS,
        Resource.STEEL,
        Resource.TITANIUM,
      ],
      colonyBonusType: ColonyBenefit.GAIN_RESOURCES,
      colonyBonusQuantity: 3,
      colonyBonusResource: Resource.MEGACREDITS,
      shouldIncreaseTrack: 'ask',
    });
  }
}
