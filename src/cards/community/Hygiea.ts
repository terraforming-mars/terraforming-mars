import {Colony, ShouldIncreaseTrack} from '../../colonies/Colony';
import {ColonyName} from '../../colonies/ColonyName';
import {ColonyBenefit} from '../../colonies/ColonyBenefit';
import {Resources} from '../../Resources';

export class Hygiea extends Colony {
    public name = ColonyName.HYGIEA;
    public description = 'Attack';
    public buildType = ColonyBenefit.OPPONENT_DISCARD;
    public tradeType = ColonyBenefit.STEAL_RESOURCES;
    public tradeQuantity = [3, 3, 3, 3, 3, 3, 3];
    public tradeResource = [
      Resources.MEGACREDITS,
      Resources.MEGACREDITS,
      Resources.HEAT,
      Resources.ENERGY,
      Resources.PLANTS,
      Resources.STEEL,
      Resources.TITANIUM,
    ];
    public colonyBonusType = ColonyBenefit.GAIN_RESOURCES;
    public colonyBonusQuantity = 3;
    public colonyBonusResource = Resources.MEGACREDITS;
    public shouldIncreaseTrack = ShouldIncreaseTrack.ASK;
}
