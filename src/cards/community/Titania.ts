import {Colony, ShouldIncreaseTrack} from '../../colonies/Colony';
import {Resources} from '../../Resources';
import {ColonyName} from '../../colonies/ColonyName';
import {ColonyBenefit} from '../../colonies/ColonyBenefit';

export class Titania extends Colony {
    public name = ColonyName.TITANIA;
    public description = 'VP';
    public buildType = ColonyBenefit.GAIN_VP;
    public buildQuantity = [5, 3, 2];
    public tradeType = ColonyBenefit.GAIN_VP;
    public tradeQuantity = [2, 2, 2, 1, 1, 0, 0];
    public colonyBonusType = ColonyBenefit.LOSE_RESOURCES;
    public colonyBonusQuantity = 3;
    public colonyBonusResource = Resources.MEGACREDITS;
    public shouldIncreaseTrack = ShouldIncreaseTrack.NO;
}
