import {Colony} from './Colony';
import {Resources} from '../common/Resources';
import {ColonyName} from '../common/colonies/ColonyName';
import {ColonyBenefit} from './ColonyBenefit';

export class Callisto extends Colony {
  public name = ColonyName.CALLISTO;
  public buildType = ColonyBenefit.GAIN_PRODUCTION;
  public override buildResource = Resources.ENERGY;
  public tradeType = ColonyBenefit.GAIN_RESOURCES;
  public override tradeQuantity = [0, 2, 3, 5, 7, 10, 13];
  public override tradeResource = Resources.ENERGY;
  public colonyBonusType = ColonyBenefit.GAIN_RESOURCES;
  public override colonyBonusQuantity = 3;
  public override colonyBonusResource = Resources.ENERGY;
}
