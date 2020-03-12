import { CardModel } from '../models/CardModel';
import { CardType } from '../cards/CardType';
// Common code for player layouts

export const PlayerMixin = {
    "methods": {
        getCardsByType: function(inCards:  Array<CardModel>, cardType: Array<CardType>) {
            let cards: Array<CardModel> = [];
            for (let index = 0; index < inCards.length; index++) {
                if (cardType.indexOf(inCards[index].cardType) !== -1) {
                    cards.push(inCards[index]);
                } 
            }
            return cards;
        },
        getActiveCardType: function() {
            return CardType.ACTIVE;
        },
        getEventCardType: function() {
            return CardType.EVENT;
        },
        getAutomatedCardType: function() {
            return CardType.AUTOMATED;
        },
        getPreludCardType: function() {
            return CardType.PRELUDE;
        }
    }
}