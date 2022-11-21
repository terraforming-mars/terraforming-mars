import {Message} from '../logs/Message';
import {CardType} from '../cards/CardType';
import {Units} from '../Units';
import {CardName} from '../cards/CardName';
import {Resources} from '../Resources';
import {CardDiscount} from '../cards/Types';
import {Tag} from '../cards/Tag';

export interface CardModel {
    name: CardName;
    resources: number | undefined;
    calculatedCost?: number;
    isSelfReplicatingRobotsCard?: boolean,
    discount?: Array<CardDiscount>,
    cardType: CardType;
    isDisabled: boolean; // Used with Pharmacy Union
    warning?: string | Message;
    reserveUnits: Readonly<Units>; // Written for The Moon, but useful in other contexts.
    bonusResource?: Array<Resources>; // Used with the Mining cards and Robotic Workforce
    cloneTag?: Tag; // Used with Pathfinders
    startingMegacredits?: number;
}
