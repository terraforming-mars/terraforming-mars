import { CardType } from '../cards/CardType';

export interface CardModel {
    name: string;
    resources: number;
    calculatedCost: number;
    cardType: CardType;
}
