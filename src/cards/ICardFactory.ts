import { CardName } from "../CardName";
import { Expansion } from "../Expansion";

export interface ICardFactory<T> {
    cardName: CardName;
    factory: new () => T;
    compatibility ?: Expansion ;
}