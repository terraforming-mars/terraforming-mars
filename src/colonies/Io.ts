import {Colony} from './Colony';
import {ColonyName} from './ColonyName';
import {ColonyBenefit} from './ColonyBenefit';
import {Resources} from '../Resources';

export class Io extends Colony {
    public name = ColonyName.IO;
    public description = 'Heat';
    public buildType = ColonyBenefit.GAIN_PRODUCTION;
    public buildResource = Resources.HEAT;
    public tradeType = ColonyBenefit.GAIN_RESOURCES;
    public tradeQuantity = [2, 3, 4, 6, 8, 10, 13];
    public tradeResource = Resources.HEAT;
    public colonyBonusType = ColonyBenefit.GAIN_RESOURCES;
    public colonyBonusQuantity = 2;
    public colonyBonusResource = Resources.HEAT;
}
