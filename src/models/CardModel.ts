import {Message} from '../Message';
import {CardType} from '../cards/CardType';
import {ResourceType} from '../ResourceType';

export interface CardModel {
    name: string;
    resources: number | undefined;
    resourceType: ResourceType | undefined;
    calculatedCost: number;
    cardType: CardType;
    isDisabled: boolean;
    warning?: string | Message;
}
