import {Colony} from './Colony';
import {ColonyName} from './ColonyName';
import {ColonyBenefitType} from './ColonyBenefitType';
import {Resources} from '../Resources';

export class Triton extends Colony {
    public name = ColonyName.TRITON;
    public description = 'Titanium';
    public buildType = ColonyBenefitType.GAIN_RESOURCES;
    public buildQuantity = [3, 3, 3];
    public buildResource = Resources.TITANIUM;
    public tradeType = ColonyBenefitType.GAIN_RESOURCES;
    public tradeQuantity = [0, 1, 1, 2, 3, 4, 5];
    public tradeResource = Resources.TITANIUM;
    public colonyBonusType = ColonyBenefitType.GAIN_RESOURCES;
    public colonyBonusResource = Resources.TITANIUM;
}
