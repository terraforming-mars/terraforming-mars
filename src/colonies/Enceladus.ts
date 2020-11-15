import {Colony} from './Colony';
import {ColonyName} from './ColonyName';
import {ColonyBenefitType} from './ColonyBenefitType';
import {ResourceType} from '../ResourceType';

export class Enceladus extends Colony {
    public name = ColonyName.ENCELADUS;
    public description = 'Microbes';
    public isActive = false;
    public resourceType = ResourceType.MICROBE;
    public buildType = ColonyBenefitType.ADD_RESOURCES_TO_CARD;
    public buildQuantity = [3, 3, 3];
    public tradeType = ColonyBenefitType.ADD_RESOURCES_TO_CARD;
    public tradeQuantity = [0, 1, 2, 3, 4, 4, 5];
    public colonyBonusType = ColonyBenefitType.ADD_RESOURCES_TO_CARD;
}
