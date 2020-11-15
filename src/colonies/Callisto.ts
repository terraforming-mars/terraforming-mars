import {Colony} from './Colony';
import {Resources} from '../Resources';
import {ColonyName} from './ColonyName';
import {ColonyBenefitType} from './ColonyBenefitType';

export class Callisto extends Colony {
    public name = ColonyName.CALLISTO;
    public description = 'Energy';
    public buildType = ColonyBenefitType.GAIN_PRODUCTION;
    public buildResource = Resources.ENERGY;
    public tradeType = ColonyBenefitType.GAIN_RESOURCES;
    public tradeQuantity = [ 0, 2, 3, 5, 7, 10, 13 ];
    public tradeResource = Resources.ENERGY;
    public colonyBonusType = ColonyBenefitType.GAIN_RESOURCES;
    public colonyBonusQuantity = 3;
    public colonyBonusResource = Resources.ENERGY;
}
