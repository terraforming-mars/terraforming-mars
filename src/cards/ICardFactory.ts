import { CardName } from "../CardName";
import { GameModule } from "../GameModule";

export interface ICardFactory<T> {
    cardName: CardName;
    factory: new () => T;
    compatibility ?: GameModule ;
}