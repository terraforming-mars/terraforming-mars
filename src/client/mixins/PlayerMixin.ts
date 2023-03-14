import {CardModel} from '@/common/models/CardModel';
import {CardType} from '@/common/cards/CardType';
import {PublicPlayerModel} from '@/common/models/PlayerModel';
import {sortActiveCards} from '@/client/utils/ActiveCardsSortingOrder';
import {getCardOrThrow} from '@/client/cards/ClientCardManifest';

// Common code for player layouts

export const PlayerMixin = {
  name: 'PlayerMixin',
  methods: {
    sortActiveCards: sortActiveCards,
    getCardsByType(inCards: Array<CardModel>, cardTypes: Array<CardType>): Array<CardModel> {
      const cards: Array<CardModel> = inCards.filter((card) => cardTypes.includes(getCardOrThrow(card.name).type));
      return cards.reverse();
    },
    isCardActivated(card: CardModel, player: PublicPlayerModel): boolean {
      return player.actionsThisGeneration.includes(card.name) || card.isDisabled;
    },
  },
};
