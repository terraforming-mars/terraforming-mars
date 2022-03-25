import {Colony} from './Colony';
import {ColonyName} from '../common/colonies/ColonyName';
import {ColonyBenefit} from '../common/colonies/ColonyBenefit';
import {ResourceType} from '../common/ResourceType';

export class Miranda extends Colony {
  public override isActive = false;
  constructor() {
    super({
      name: ColonyName.MIRANDA,
      resourceType: ResourceType.ANIMAL,
      buildType: ColonyBenefit.ADD_RESOURCES_TO_CARD,
      tradeType: ColonyBenefit.ADD_RESOURCES_TO_CARD,
      tradeQuantity: [0, 1, 1, 2, 2, 3, 3],
      colonyBonusType: ColonyBenefit.DRAW_CARDS,
    });
  }
}
