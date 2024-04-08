import {CardModel} from '@/common/models/CardModel';
import {CardType} from '@/common/cards/CardType';
import {PublicPlayerModel} from '@/common/models/PlayerModel';
import {getCard} from '@/client/cards/ClientCardManifest';

export function getCardsByType(inCards: Array<CardModel>, cardTypes: Array<CardType>): Array<CardModel> {
  const outCards = inCards.filter((inCard) => {
    const outCard = getCard(inCard.name);
    if (outCard === undefined) {
      return false;
    }
    return cardTypes.includes(outCard.type);
  });
  return outCards.reverse();
}

export function isCardActivated(card: CardModel, player: PublicPlayerModel): boolean {
  return player.actionsThisGeneration.includes(card.name) || (card.isDisabled === true);
}
