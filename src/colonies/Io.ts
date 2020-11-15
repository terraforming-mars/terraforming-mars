import {Colony} from './Colony';
import {ColonyName} from './ColonyName';
import {ColonyBenefitType} from './ColonyBenefitType';
import {Resources} from '../Resources';

export class Io extends Colony {
    public name = ColonyName.IO;
    public description = 'Heat';
    public buildType = ColonyBenefitType.GAIN_PRODUCTION;
    public buildResource = Resources.HEAT;
    public tradeType = ColonyBenefitType.GAIN_RESOURCES;
    public tradeQuantity = [ 2, 3, 4, 6, 8, 10, 13 ];
    public tradeResource = Resources.HEAT;
    public colonyBonusType = ColonyBenefitType.GAIN_RESOURCES;
    public colonyBonusQuantity = 2;
    public colonyBonusResource = Resources.HEAT;
}
