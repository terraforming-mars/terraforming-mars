import {Colony} from '../../colonies/Colony';
import {ColonyName} from '../../colonies/ColonyName';
import {ColonyBenefitType} from '../../colonies/ColonyBenefitType';

export class Iapetus extends Colony {
    public name = ColonyName.IAPETUS;
    public description = 'TR';
    public buildType = ColonyBenefitType.GAIN_TR;
    public tradeType = ColonyBenefitType.GAIN_TR;
    public tradeQuantity = [ 0, 0, 0, 1, 1, 1, 2 ];
    public colonyBonusType = ColonyBenefitType.GAIN_CARD_DISCOUNT;
}
