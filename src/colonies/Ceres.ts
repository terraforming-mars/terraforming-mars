import {Colony} from './Colony';
import {ColonyName} from './ColonyName';
import {ColonyBenefitType} from './ColonyBenefitType';
import {Resources} from '../Resources';

export class Ceres extends Colony {
    public name = ColonyName.CERES;
    public description = 'Steel';
    public buildType = ColonyBenefitType.GAIN_PRODUCTION;
    public buildResource = Resources.STEEL;
    public tradeType = ColonyBenefitType.GAIN_RESOURCES;
    public tradeQuantity = [1, 2, 3, 4, 6, 8, 10];
    public tradeResource = Resources.STEEL;
    public colonyBonusType = ColonyBenefitType.GAIN_RESOURCES;
    public colonyBonusQuantity = 2;
    public colonyBonusResource = Resources.STEEL;
}
