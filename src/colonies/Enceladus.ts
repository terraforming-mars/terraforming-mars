import {Colony} from './Colony';
import {ColonyName} from '../common/colonies/ColonyName';
import {ColonyBenefit} from './ColonyBenefit';
import {ResourceType} from '../common/ResourceType';

export class Enceladus extends Colony {
  public name = ColonyName.ENCELADUS;
  public override isActive = false;
  public override resourceType = ResourceType.MICROBE;
  public buildType = ColonyBenefit.ADD_RESOURCES_TO_CARD;
  public override buildQuantity = [3, 3, 3];
  public tradeType = ColonyBenefit.ADD_RESOURCES_TO_CARD;
  public override tradeQuantity = [0, 1, 2, 3, 4, 4, 5];
  public colonyBonusType = ColonyBenefit.ADD_RESOURCES_TO_CARD;
}
