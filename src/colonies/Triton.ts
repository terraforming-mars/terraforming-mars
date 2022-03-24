import {Colony} from './Colony';
import {ColonyName} from '../common/colonies/ColonyName';
import {ColonyBenefit} from './ColonyBenefit';
import {Resources} from '../common/Resources';

export class Triton extends Colony {
  public name = ColonyName.TRITON;
  public buildType = ColonyBenefit.GAIN_RESOURCES;
  public override buildQuantity = [3, 3, 3];
  public override buildResource = Resources.TITANIUM;
  public tradeType = ColonyBenefit.GAIN_RESOURCES;
  public override tradeQuantity = [0, 1, 1, 2, 3, 4, 5];
  public override tradeResource = Resources.TITANIUM;
  public colonyBonusType = ColonyBenefit.GAIN_RESOURCES;
  public override colonyBonusResource = Resources.TITANIUM;
}
