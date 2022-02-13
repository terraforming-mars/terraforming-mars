import {Message} from '../logs/Message';
import {CardType} from '../cards/CardType';
import {ResourceType} from '../ResourceType';
import {Units} from '../Units';
import {CardName} from '../cards/CardName';
import {Resources} from '../Resources';
import {ICardDiscount} from '../cards/Types';
import {Tags} from '../cards/Tags';

export interface CardModel {
    name: CardName;
    resources: number | undefined;
    resourceType: ResourceType | undefined;
    calculatedCost?: number;
    discount?: Array<ICardDiscount>,
    cardType: CardType;
    isDisabled: boolean;
    warning?: string | Message;
    reserveUnits: Readonly<Units>; // Written for The Moon, but useful in other contexts.
    bonusResource?: Array<Resources>; // Used with the Mining cards and Robotic Workforce
    cloneTag?: Tags; // Used with Pathfinders
    startingMegacredits?: number;
}
