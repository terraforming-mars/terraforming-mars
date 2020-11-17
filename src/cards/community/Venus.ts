import {Colony} from '../../colonies/Colony';
import {ColonyName} from '../../colonies/ColonyName';
import {ColonyBenefit} from '../../colonies/ColonyBenefit';

export class Venus extends Colony {
    public name = ColonyName.VENUS;
    public isActive = false;
    public description = 'Venus';
    public buildType = ColonyBenefit.INCREASE_VENUS_SCALE;
    public tradeType = ColonyBenefit.ADD_RESOURCES_TO_VENUS_CARD;
    public tradeQuantity = [0, 0, 0, 1, 2, 3, 4];
    public colonyBonusType = ColonyBenefit.ADD_RESOURCES_TO_VENUS_CARD;
}
