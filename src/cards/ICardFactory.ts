import { CardName } from "../CardName";

export interface ICardFactory<T> {
    cardName: CardName;
    factory: new () => T
}