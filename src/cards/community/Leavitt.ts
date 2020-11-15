import {Colony} from '../../colonies/Colony';
import {ColonyName} from '../../colonies/ColonyName';
import {ColonyBenefitType} from '../../colonies/ColonyBenefitType';

export class Leavitt extends Colony {
    public name = ColonyName.LEAVITT;
    public description = 'Science';
    public buildType = ColonyBenefitType.GAIN_SCIENCE_TAG;
    public tradeType = ColonyBenefitType.DRAW_CARDS_AND_KEEP_ONE;
    public tradeQuantity = [1, 2, 3, 4, 5, 6, 7];
    public colonyBonusType = ColonyBenefitType.DRAW_CARDS_AND_BUY_ONE;
}
