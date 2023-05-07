import {Colony} from '../../colonies/Colony';
import {ColonyName} from '../../../common/colonies/ColonyName';
import {ColonyBenefit} from '../../../common/colonies/ColonyBenefit';
import {Resource} from '../../../common/Resource';

export class Mercury extends Colony {
  constructor() {
    super({
      name: ColonyName.MERCURY,
      buildType: ColonyBenefit.COPY_TRADE,
      tradeType: ColonyBenefit.GAIN_PRODUCTION,
      tradeResource: [
        Resource.HEAT, Resource.HEAT, Resource.HEAT,
        Resource.STEEL, Resource.STEEL,
        Resource.TITANIUM, Resource.TITANIUM,
      ],
      colonyBonusType: ColonyBenefit.GAIN_RESOURCES,
      colonyBonusResource: Resource.MEGACREDITS,
      colonyBonusQuantity: 2,
      shouldIncreaseTrack: 'ask',
    });
  }
}
