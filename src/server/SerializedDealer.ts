import {CardName} from '../common/cards/CardName';

export type SerializedDealer = {
    corporationCards: Array<CardName>;
    deck: Array<CardName>;
    discarded: Array<CardName>;
    preludeDeck: Array<CardName>;
}
