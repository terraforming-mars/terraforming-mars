import {CardModel} from '@/common/models/CardModel';
import {CardType} from '@/common/cards/CardType';
import {PublicPlayerModel} from '@/common/models/PlayerModel';
import {sortActiveCards} from '@/client/utils/ActiveCardsSortingOrder';

// Common code for player layouts

export const PlayerMixin = {
  name: 'PlayerMixin',
  methods: {
    sortActiveCards: sortActiveCards,
    getCardsByType(
      inCards: Array<CardModel>,
      cardTypes: Array<CardType>,
    ) {
      const cards: Array<CardModel> = inCards.filter((card) => cardTypes.includes(card.cardType));
      return cards.reverse();
    },
    isCardActivated(card: CardModel, player: PublicPlayerModel): boolean {
      return player.actionsThisGeneration.includes(card.name) || card.isDisabled;
    },
  },
};
