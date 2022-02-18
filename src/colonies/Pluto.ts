import {Colony} from './Colony';
import {ColonyName} from '../common/colonies/ColonyName';
import {ColonyBenefit} from './ColonyBenefit';

export class Pluto extends Colony {
  public name = ColonyName.PLUTO;
  public buildType = ColonyBenefit.DRAW_CARDS;
  public override buildQuantity = [2, 2, 2];
  public tradeType = ColonyBenefit.DRAW_CARDS;
  public override tradeQuantity = [0, 1, 2, 2, 3, 3, 4];
  public colonyBonusType = ColonyBenefit.DRAW_CARDS_AND_DISCARD_ONE;
}
