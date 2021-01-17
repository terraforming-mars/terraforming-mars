import {CardModel} from '../models/CardModel';
import {CardType} from '../cards/CardType';
import {PlayerModel} from '../models/PlayerModel';
import {ActiveCardsSortingOrder} from '../components/ActiveCardsSortingOrder';
import {CardName} from '../CardName';

// Common code for player layouts

export const PlayerMixin = {
  'name': 'PlayerMixin',
  'methods': {
    sortActiveCards: function(inCards: Array<CardModel>): Array<CardModel> {
      return inCards.sort(function(cardA, cardB) {
        return (ActiveCardsSortingOrder.get(cardA.name as CardName) || 0) - (ActiveCardsSortingOrder.get(cardB.name as CardName) || 0);
      });
    },
    getCardsByType: function(
      inCards: Array<CardModel>,
      cardType: Array<CardType>,
    ) {
      const cards: Array<CardModel> = [];
      for (let index = 0; index < inCards.length; index++) {
        if (cardType.indexOf(inCards[index].cardType) !== -1) {
          cards.push(inCards[index]);
        }
      }
      if (cardType.length === 1 && cardType[0] === CardType.ACTIVE) {
        return this.sortActiveCards(cards);
      } else {
        return cards.reverse();
      }
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
                player.actionsThisGeneration.indexOf(card.name) !== -1) || card.isDisabled
      );
    },
  },
};
