import {Colony, ShouldIncreaseTrack} from './Colony';
import {Resources} from '../Resources';
import {ColonyName} from './ColonyName';
import {ColonyBenefitType} from './ColonyBenefitType';

export class Europa extends Colony {
    public name = ColonyName.EUROPA;
    public description = 'Production';
    public buildType = ColonyBenefitType.PLACE_OCEAN_TILE;
    public tradeType = ColonyBenefitType.GAIN_PRODUCTION;
    public tradeResource = [
      Resources.MEGACREDITS, Resources.MEGACREDITS,
      Resources.ENERGY, Resources.ENERGY,
      Resources.PLANTS, Resources.PLANTS, Resources.PLANTS,
    ];
    public colonyBonusType = ColonyBenefitType.GAIN_RESOURCES;
    public colonyBonusResource = Resources.MEGACREDITS;
    public shouldIncreaseTrack = ShouldIncreaseTrack.ASK;
}
