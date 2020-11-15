import {Colony} from './Colony';
import {ColonyName} from './ColonyName';
import {ColonyBenefitType} from './ColonyBenefitType';
import {Resources} from '../Resources';

export class Luna extends Colony {
    public name = ColonyName.LUNA;
    public description = 'MegaCredits';
    public buildType = ColonyBenefitType.GAIN_PRODUCTION;
    public buildQuantity = [2, 2, 2];
    public buildResource = Resources.MEGACREDITS;
    public tradeType = ColonyBenefitType.GAIN_RESOURCES;
    public tradeQuantity = [1, 2, 4, 7, 10, 13, 17];
    public tradeResource = Resources.MEGACREDITS;
    public colonyBonusType = ColonyBenefitType.GAIN_RESOURCES;
    public colonyBonusQuantity = 2;
    public colonyBonusResource = Resources.MEGACREDITS;
}
