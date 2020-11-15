import {Colony} from './Colony';
import {ColonyName} from './ColonyName';
import {ColonyBenefitType} from './ColonyBenefitType';
import {ResourceType} from '../ResourceType';

export class Titan extends Colony {
    public name = ColonyName.TITAN;
    public description = 'Floaters';
    public isActive = false;
    public resourceType = ResourceType.FLOATER;
    public buildType = ColonyBenefitType.ADD_RESOURCES_TO_CARD;
    public buildQuantity = [3, 3, 3];
    public tradeType = ColonyBenefitType.ADD_RESOURCES_TO_CARD;
    public tradeQuantity = [0, 1, 1, 2, 3, 3, 4];
    public colonyBonusType = ColonyBenefitType.ADD_RESOURCES_TO_CARD;
}
