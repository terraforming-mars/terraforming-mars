import {CardModel} from '../models/CardModel';
import {CardType} from '../cards/CardType';
import {PlayerModel} from '../models/PlayerModel';
import {sortActiveCards} from '../components/ActiveCardsSortingOrder';

// Common code for player layouts

export const PlayerMixin = {
  'name': 'PlayerMixin',
  'methods': {
    sortActiveCards: sortActiveCards,
    getCardsByType: function(
      inCards: Array<CardModel>,
      cardType: Array<CardType>,
    ) {
      const cards: Array<CardModel> = [];
      for (let index = 0; index < inCards.length; index++) {
        if (cardType.includes(inCards[index].cardType)) {
          cards.push(inCards[index]);
        }
      }
      return cards.reverse();
    },
    getPlayerCardsPlayed: function(
      player: PlayerModel,
      withCorp: boolean,
    ): number {
      const playedCardsNr = player.playedCards.length || 0;
      return withCorp ? playedCardsNr + 1 : playedCardsNr;
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
    getPreludeCardType: function() {
      return CardType.PRELUDE;
    },
    isCardActivated: function(
      card: CardModel,
      player: PlayerModel,
    ): boolean {
      return (
        (player !== undefined &&
                player.actionsThisGeneration !== undefined &&
                player.actionsThisGeneration.includes(card.name)) || card.isDisabled
      );
    },
  },
};
