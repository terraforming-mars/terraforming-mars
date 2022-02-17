import {Colony} from '../../colonies/Colony';
import {ColonyName} from '../../common/colonies/ColonyName';
import {ColonyBenefit} from '../../colonies/ColonyBenefit';

export class Pallas extends Colony {
  public name = ColonyName.PALLAS;
  public buildType = ColonyBenefit.GAIN_INFLUENCE;
  public tradeType = ColonyBenefit.PLACE_DELEGATES;
  public override tradeQuantity = [1, 1, 1, 2, 2, 2, 3];
  public colonyBonusType = ColonyBenefit.GIVE_MC_PER_DELEGATE;
}
