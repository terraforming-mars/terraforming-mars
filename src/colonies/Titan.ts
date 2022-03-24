import {Colony} from './Colony';
import {ColonyName} from '../common/colonies/ColonyName';
import {ColonyBenefit} from './ColonyBenefit';
import {ResourceType} from '../common/ResourceType';

export class Titan extends Colony {
  public name = ColonyName.TITAN;
  public override isActive = false;
  public override resourceType = ResourceType.FLOATER;
  public buildType = ColonyBenefit.ADD_RESOURCES_TO_CARD;
  public override buildQuantity = [3, 3, 3];
  public tradeType = ColonyBenefit.ADD_RESOURCES_TO_CARD;
  public override tradeQuantity = [0, 1, 1, 2, 3, 3, 4];
  public colonyBonusType = ColonyBenefit.ADD_RESOURCES_TO_CARD;
}
