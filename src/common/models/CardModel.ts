import {Message} from '../logs/Message';
import {CardName} from '../cards/CardName';
import {Resource} from '../Resource';
import {CardDiscount} from '../cards/Types';
import {Tag} from '../cards/Tag';
import {Warning} from '../cards/Warning';

export interface CardModel {
    name: CardName;
    resources: number | undefined;
    calculatedCost?: number;
    isSelfReplicatingRobotsCard?: boolean,
    discount?: Array<CardDiscount>,
    isDisabled?: boolean; // Used with Pharmacy Union
    warning?: string | Message;
    warnings?: ReadonlyArray<Warning>;
    bonusResource?: Array<Resource>; // Used with the Mining cards and Robotic Workforce
    cloneTag?: Tag; // Used with Pathfinders
    showOwner?: boolean;
}
