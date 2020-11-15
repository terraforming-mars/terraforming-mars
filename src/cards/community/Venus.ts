import {Colony} from '../../colonies/Colony';
import {ColonyName} from '../../colonies/ColonyName';
import {ColonyBenefitType} from '../../colonies/ColonyBenefitType';

export class Venus extends Colony {
    public name = ColonyName.VENUS;
    public isActive = false;
    public description = 'Venus';
    public buildType = ColonyBenefitType.INCREASE_VENUS_SCALE;
    public tradeType = ColonyBenefitType.ADD_RESOURCES_TO_VENUS_CARD;
    public tradeQuantity = [0, 0, 0, 1, 2, 3, 4];
    public colonyBonusType = ColonyBenefitType.ADD_RESOURCES_TO_VENUS_CARD;
}
