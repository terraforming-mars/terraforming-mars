import { CardType } from '../cards/CardType';

export interface CardModel {
    name: string;
    resources: number | undefined;
    calculatedCost: number;
    cardType: CardType;
}
