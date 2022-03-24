import {Colony} from './Colony';
import {Resources} from '../common/Resources';
import {ColonyName} from '../common/colonies/ColonyName';
import {ColonyBenefit} from './ColonyBenefit';

export class Ganymede extends Colony {
  public name = ColonyName.GANYMEDE;
  public buildType = ColonyBenefit.GAIN_PRODUCTION;
  public override buildResource = Resources.PLANTS;
  public tradeType = ColonyBenefit.GAIN_RESOURCES;
  public override tradeQuantity = [0, 1, 2, 3, 4, 5, 6];
  public override tradeResource = Resources.PLANTS;
  public colonyBonusType = ColonyBenefit.GAIN_RESOURCES;
  public override colonyBonusResource = Resources.PLANTS;
}
