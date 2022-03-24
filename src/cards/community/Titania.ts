import {Colony} from '../../colonies/Colony';
import {Resources} from '../../common/Resources';
import {ColonyName} from '../../common/colonies/ColonyName';
import {ColonyBenefit} from '../../colonies/ColonyBenefit';
import {ShouldIncreaseTrack} from '../../common/colonies/ShouldIncreaseTrack';

export class Titania extends Colony {
  public name = ColonyName.TITANIA;
  public buildType = ColonyBenefit.GAIN_VP;
  public override buildQuantity = [5, 3, 2];
  public tradeType = ColonyBenefit.GAIN_VP;
  public override tradeQuantity = [2, 2, 2, 1, 1, 0, 0];
  public colonyBonusType = ColonyBenefit.LOSE_RESOURCES;
  public override colonyBonusQuantity = 3;
  public override colonyBonusResource = Resources.MEGACREDITS;
  public override shouldIncreaseTrack = ShouldIncreaseTrack.NO;
}
