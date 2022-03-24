import {Colony} from './Colony';
import {ColonyName} from '../common/colonies/ColonyName';
import {ColonyBenefit} from './ColonyBenefit';
import {ResourceType} from '../common/ResourceType';

export class Miranda extends Colony {
  public name = ColonyName.MIRANDA;
  public override isActive = false;
  public override resourceType = ResourceType.ANIMAL;
  public buildType = ColonyBenefit.ADD_RESOURCES_TO_CARD;
  public tradeType = ColonyBenefit.ADD_RESOURCES_TO_CARD;
  public override tradeQuantity = [0, 1, 1, 2, 2, 3, 3];
  public colonyBonusType = ColonyBenefit.DRAW_CARDS;
}
