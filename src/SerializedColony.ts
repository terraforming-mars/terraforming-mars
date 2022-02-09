
import {ColonyName} from './common/colonies/ColonyName';
import {PlayerId} from './common/Types';
import {ResourceType} from './common/ResourceType';

export interface SerializedColony {
    name: ColonyName;
    colonies: Array<PlayerId>;
    isActive: boolean;
    resourceType?: ResourceType;
    trackPosition: number;
    visitor: undefined | PlayerId;
}

