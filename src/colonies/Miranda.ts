import {Colony} from './Colony';
import {ColonyName} from './ColonyName';
import {ColonyBenefitType} from './ColonyBenefitType';
import {ResourceType} from '../ResourceType';

export class Miranda extends Colony {
    public name = ColonyName.MIRANDA;
    public description = 'Animals';
    public isActive = false;
    public resourceType = ResourceType.ANIMAL;
    public buildType = ColonyBenefitType.ADD_RESOURCES_TO_CARD;
    public tradeType = ColonyBenefitType.ADD_RESOURCES_TO_CARD;
    public tradeQuantity = [0, 1, 1, 2, 2, 3, 3];
    public colonyBonusType = ColonyBenefitType.DRAW_CARDS;
}
