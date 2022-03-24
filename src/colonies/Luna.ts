import {Colony} from './Colony';
import {ColonyName} from '../common/colonies/ColonyName';
import {ColonyBenefit} from './ColonyBenefit';
import {Resources} from '../common/Resources';

export class Luna extends Colony {
  public name = ColonyName.LUNA;
  public buildType = ColonyBenefit.GAIN_PRODUCTION;
  public override buildQuantity = [2, 2, 2];
  public override buildResource = Resources.MEGACREDITS;
  public tradeType = ColonyBenefit.GAIN_RESOURCES;
  public override tradeQuantity = [1, 2, 4, 7, 10, 13, 17];
  public override tradeResource = Resources.MEGACREDITS;
  public colonyBonusType = ColonyBenefit.GAIN_RESOURCES;
  public override colonyBonusQuantity = 2;
  public override colonyBonusResource = Resources.MEGACREDITS;
}
