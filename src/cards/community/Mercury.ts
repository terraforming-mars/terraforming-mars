import {Colony, ShouldIncreaseTrack} from '../../colonies/Colony';
import {ColonyName} from '../../colonies/ColonyName';
import {ColonyBenefitType} from '../../colonies/ColonyBenefitType';
import {Resources} from '../../Resources';

export class Mercury extends Colony {
    public name = ColonyName.MERCURY;
    public description = 'Production';
    public buildType = ColonyBenefitType.COPY_TRADE;
    public tradeType = ColonyBenefitType.GAIN_PRODUCTION;
    public tradeResource = [
      Resources.HEAT, Resources.HEAT, Resources.HEAT,
      Resources.STEEL, Resources.STEEL,
      Resources.TITANIUM, Resources.TITANIUM,
    ];
    public colonyBonusType = ColonyBenefitType.GAIN_RESOURCES;
    public colonyBonusResource = Resources.MEGACREDITS;
    public shouldIncreaseTrack = ShouldIncreaseTrack.ASK;
}
