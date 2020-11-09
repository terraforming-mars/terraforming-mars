
import {ColonyName} from './colonies/ColonyName';
import {PlayerId} from './Player';
import {ResourceType} from './ResourceType';

export interface SerializedColony {
    name: ColonyName;
    description: string;
    isActive: boolean;
    visitor: undefined | PlayerId;
    trackPosition: number;
    colonies: Array<PlayerId>;
    resourceType?: ResourceType;
}

