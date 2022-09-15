import {GameModule} from '../../common/cards/GameModule';

export interface ICardFactory<T> {
    Factory: new () => T;
    compatibility ?: GameModule | Array<GameModule>;
}
