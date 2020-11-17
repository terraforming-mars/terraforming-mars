import {Colony} from './Colony';
import {ColonyName} from './ColonyName';
import {ColonyBenefit} from './ColonyBenefit';
import {Resources} from '../Resources';

export class Triton extends Colony {
    public name = ColonyName.TRITON;
    public description = 'Titanium';
    public buildType = ColonyBenefit.GAIN_RESOURCES;
    public buildQuantity = [3, 3, 3];
    public buildResource = Resources.TITANIUM;
    public tradeType = ColonyBenefit.GAIN_RESOURCES;
    public tradeQuantity = [0, 1, 1, 2, 3, 4, 5];
    public tradeResource = Resources.TITANIUM;
    public colonyBonusType = ColonyBenefit.GAIN_RESOURCES;
    public colonyBonusResource = Resources.TITANIUM;
}
