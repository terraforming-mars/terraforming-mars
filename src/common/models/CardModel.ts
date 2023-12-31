import {Message} from '../logs/Message';
import {Units} from '../Units';
import {CardName} from '../cards/CardName';
import {Resource} from '../Resource';
import {CardDiscount} from '../cards/Types';
import {RequirementType} from '../cards/RequirementType';
import {Tag} from '../cards/Tag';

export interface RequirementModifierEntry {
    type: RequirementType;
    modifier: number;
}

export interface CardModel {
    name: CardName;
    resources: number | undefined;
    calculatedCost?: number;
    isSelfReplicatingRobotsCard?: boolean,
    discount?: Array<CardDiscount>,
    // TODO: Ideally this would be a Map<RequirementType, number> but Maps don't JSON serialize.
    // We should probably polyfill a toJSON and fromJSON into Map rather than storing this as an Array.
    requirementsModifiers: Array<RequirementModifierEntry>,
    isDisabled?: boolean; // Used with Pharmacy Union
    warning?: string | Message;
    reserveUnits?: Readonly<Units>; // Written for The Moon, but useful in other contexts.
    bonusResource?: Array<Resource>; // Used with the Mining cards and Robotic Workforce
    cloneTag?: Tag; // Used with Pathfinders
}
