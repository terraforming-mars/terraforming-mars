import {CardName} from '../CardName';
import {GameModule} from '../GameModule';

export interface ICardFactory<T> {
    cardName: CardName;
    Factory: new () => T;
    compatibility ?: GameModule | Array<GameModule>;
}
