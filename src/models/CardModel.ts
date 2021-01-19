import {Message} from '../Message';
import {CardType} from '../cards/CardType';
import {ResourceType} from '../ResourceType';
import {Units} from '../Units';

export interface CardModel {
    name: string;
    resources: number | undefined;
    resourceType: ResourceType | undefined;
    calculatedCost: number;
    cardType: CardType;
    isDisabled: boolean;
    warning?: string | Message;
    reserveUnits: Readonly<Units>;
}
