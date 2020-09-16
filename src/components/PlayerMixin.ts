import { CardModel } from "../models/CardModel";
import { CardType } from "../cards/CardType";
import { PlayerModel } from "../models/PlayerModel";
// Common code for player layouts

export const PlayerMixin = {
    "methods": {
        getCardsByType: function (
            inCards: Array<CardModel>,
            cardType: Array<CardType>
        ) {
            let cards: Array<CardModel> = [];
            for (let index = 0; index < inCards.length; index++) {
                if (cardType.indexOf(inCards[index].cardType) !== -1) {
                    cards.push(inCards[index]);
                }
            }
            return cards.reverse();
        },
        getPlayerCardsPlayed: function (
            player: PlayerModel,
            withCorp: boolean
        ): number {
            const playedCardsNr = player.playedCards.length || 0;
            return withCorp ? playedCardsNr + 1 : playedCardsNr;
        },
        getActiveCardType: function () {
            return CardType.ACTIVE;
        },
        getEventCardType: function () {
            return CardType.EVENT;
        },
        getAutomatedCardType: function () {
            return CardType.AUTOMATED;
        },
        getPreludeCardType: function () {
            return CardType.PRELUDE;
        },
        isCardActivated: function (
            card: CardModel,
            player: PlayerModel
        ): boolean {
            return (
                player !== undefined &&
                player.actionsThisGeneration !== undefined &&
                player.actionsThisGeneration.indexOf(card.name) !== -1
            );
        },
    },
};
