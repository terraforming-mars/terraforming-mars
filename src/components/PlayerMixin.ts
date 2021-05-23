import {CardModel} from '../models/CardModel';
import {CardType} from '../cards/CardType';
import {PublicPlayerModel} from '../models/PlayerModel';
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
      player: PublicPlayerModel,
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
      // TODO(kberg): The | undefined was added because PlayerHomeView uses publicPlayer(),
      // which makes it hard to elegaently rely on Typescript's compiler to know that the
      // incoming corporation card is certainly defined.
      card: CardModel | undefined,
      player: PublicPlayerModel,
    ): boolean {
      return card !== undefined &&
          ((player.actionsThisGeneration !== undefined &&
            player.actionsThisGeneration.includes(card.name)) ||
          card.isDisabled);
    },
  },
};
