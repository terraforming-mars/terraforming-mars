import {Colony} from './Colony';
import {ColonyName} from '../common/colonies/ColonyName';
import {ColonyBenefit} from './ColonyBenefit';
import {Resources} from '../common/Resources';

export class Io extends Colony {
  public name = ColonyName.IO;
  public buildType = ColonyBenefit.GAIN_PRODUCTION;
  public override buildResource = Resources.HEAT;
  public tradeType = ColonyBenefit.GAIN_RESOURCES;
  public override tradeQuantity = [2, 3, 4, 6, 8, 10, 13];
  public override tradeResource = Resources.HEAT;
  public colonyBonusType = ColonyBenefit.GAIN_RESOURCES;
  public override colonyBonusQuantity = 2;
  public override colonyBonusResource = Resources.HEAT;
}
