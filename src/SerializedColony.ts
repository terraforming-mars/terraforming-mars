
import {ColonyName} from './colonies/ColonyName';
import {PlayerId} from './Player';
import {ResourceType} from './ResourceType';

export interface SerializedColony {
    colonies: Array<PlayerId>;
    description: string;
    name: ColonyName;
    isActive: boolean;
    resourceType?: ResourceType;
    trackPosition: number;
    visitor: undefined | PlayerId;
}

