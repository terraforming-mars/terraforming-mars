import {CardModel} from '@/common/models/CardModel';
import {CardType} from '@/common/cards/CardType';
import {PublicPlayerModel} from '@/common/models/PlayerModel';
import {sortActiveCards} from '@/client/utils/ActiveCardsSortingOrder';

// Common code for player layouts

export const PlayerMixin = {
  'name': 'PlayerMixin',
  'methods': {
    sortActiveCards: sortActiveCards,
    getCardsByType(
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
    getPlayerCardsPlayed(
      player: PublicPlayerModel,
      withCorp: boolean,
    ): number {
      const playedCardsNr = player.playedCards.length || 0;
      return withCorp ? playedCardsNr + 1 : playedCardsNr;
    },
    getActiveCardType() {
      return CardType.ACTIVE;
    },
    getEventCardType() {
      return CardType.EVENT;
    },
    getAutomatedCardType() {
      return CardType.AUTOMATED;
    },
    getPreludeCardType() {
      return CardType.PRELUDE;
    },
    isCardActivated(
      card: CardModel,
      player: PublicPlayerModel,
    ): boolean {
      return (
        (player !== undefined &&
                player.actionsThisGeneration !== undefined &&
                player.actionsThisGeneration.includes(card.name)) || card.isDisabled
      );
    },
  },
};
