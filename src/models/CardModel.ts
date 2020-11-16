import {CardType} from '../cards/CardType';
import {ResourceType} from '../ResourceType';

export interface CardModel {
    name: string;
    resources: number | undefined;
    resourceType: ResourceType | undefined;
    calculatedCost: number;
    mustSpendAtMost?: number;
    cardType: CardType;
    isDisabled: boolean;
}
