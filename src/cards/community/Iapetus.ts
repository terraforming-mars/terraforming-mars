import {Colony} from '../../colonies/Colony';
import {ColonyName} from '../../common/colonies/ColonyName';
import {ColonyBenefit} from '../../colonies/ColonyBenefit';

export class Iapetus extends Colony {
  public name = ColonyName.IAPETUS;
  public buildType = ColonyBenefit.GAIN_TR;
  public tradeType = ColonyBenefit.GAIN_TR;
  public override tradeQuantity = [0, 0, 0, 1, 1, 1, 2];
  public colonyBonusType = ColonyBenefit.GAIN_CARD_DISCOUNT;
}
