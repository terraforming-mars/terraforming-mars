import {CardName} from './common/cards/CardName';

export interface SerializedDealer {
    corporationCards: Array<CardName>;
    deck: Array<CardName>;
    discarded: Array<CardName>;
    preludeDeck: Array<CardName>;
}
