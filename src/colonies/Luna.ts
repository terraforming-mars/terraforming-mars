import {Colony} from './Colony';
import {ColonyName} from './ColonyName';
import {ColonyBenefit} from './ColonyBenefit';
import {Resources} from '../Resources';

export class Luna extends Colony {
    public name = ColonyName.LUNA;
    public description = 'MegaCredits';
    public buildType = ColonyBenefit.GAIN_PRODUCTION;
    public buildQuantity = [2, 2, 2];
    public buildResource = Resources.MEGACREDITS;
    public tradeType = ColonyBenefit.GAIN_RESOURCES;
    public tradeQuantity = [1, 2, 4, 7, 10, 13, 17];
    public tradeResource = Resources.MEGACREDITS;
    public colonyBonusType = ColonyBenefit.GAIN_RESOURCES;
    public colonyBonusQuantity = 2;
    public colonyBonusResource = Resources.MEGACREDITS;
}
