
import {ColonyName} from './colonies/ColonyName';
import {PlayerId} from './common/Types';
import {ResourceType} from './common/ResourceType';

export interface SerializedColony {
    colonies: Array<PlayerId>;
    description: string;
    name: ColonyName;
    isActive: boolean;
    resourceType?: ResourceType;
    trackPosition: number;
    visitor: undefined | PlayerId;
}

