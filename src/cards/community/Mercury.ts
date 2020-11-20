import {Colony, ShouldIncreaseTrack} from '../../colonies/Colony';
import {ColonyName} from '../../colonies/ColonyName';
import {ColonyBenefit} from '../../colonies/ColonyBenefit';
import {Resources} from '../../Resources';

export class Mercury extends Colony {
    public name = ColonyName.MERCURY;
    public description = 'Production';
    public buildType = ColonyBenefit.COPY_TRADE;
    public tradeType = ColonyBenefit.GAIN_PRODUCTION;
    public tradeResource = [
      Resources.HEAT, Resources.HEAT, Resources.HEAT,
      Resources.STEEL, Resources.STEEL,
      Resources.TITANIUM, Resources.TITANIUM,
    ];
    public colonyBonusType = ColonyBenefit.GAIN_RESOURCES;
    public colonyBonusResource = Resources.MEGACREDITS;
    public colonyBonusQuantity = 2;
    public shouldIncreaseTrack = ShouldIncreaseTrack.ASK;
}
