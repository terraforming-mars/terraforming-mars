import {CardName} from '../CardName';
import {GameModule} from '../GameModule';

export interface ICardFactory<T> {
    cardName: CardName;
    compatibility?: GameModule;
    factory: () => T;
}
