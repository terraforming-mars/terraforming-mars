import {Colony} from './Colony';
import {ColonyName} from './ColonyName';
import {ColonyBenefit} from './ColonyBenefit';
import {Resources} from '../Resources';

export class Ceres extends Colony {
    public name = ColonyName.CERES;
    public description = 'Steel';
    public buildType = ColonyBenefit.GAIN_PRODUCTION;
    public buildResource = Resources.STEEL;
    public tradeType = ColonyBenefit.GAIN_RESOURCES;
    public tradeQuantity = [1, 2, 3, 4, 6, 8, 10];
    public tradeResource = Resources.STEEL;
    public colonyBonusType = ColonyBenefit.GAIN_RESOURCES;
    public colonyBonusQuantity = 2;
    public colonyBonusResource = Resources.STEEL;
}
