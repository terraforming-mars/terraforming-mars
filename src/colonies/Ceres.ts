import {Colony} from './Colony';
import {ColonyName} from '../common/colonies/ColonyName';
import {ColonyBenefit} from './ColonyBenefit';
import {Resources} from '../common/Resources';

export class Ceres extends Colony {
  public name = ColonyName.CERES;
  public buildType = ColonyBenefit.GAIN_PRODUCTION;
  public override buildResource = Resources.STEEL;
  public tradeType = ColonyBenefit.GAIN_RESOURCES;
  public override tradeQuantity = [1, 2, 3, 4, 6, 8, 10];
  public override tradeResource = Resources.STEEL;
  public colonyBonusType = ColonyBenefit.GAIN_RESOURCES;
  public override colonyBonusQuantity = 2;
  public override colonyBonusResource = Resources.STEEL;
}
