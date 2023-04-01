import {CardModel} from '@/common/models/CardModel';
import {CardType} from '@/common/cards/CardType';
import {PublicPlayerModel} from '@/common/models/PlayerModel';
import {getCardOrThrow} from '@/client/cards/ClientCardManifest';

export function getCardsByType(inCards: Array<CardModel>, cardTypes: Array<CardType>): Array<CardModel> {
  const cards: Array<CardModel> = inCards.filter((card) => cardTypes.includes(getCardOrThrow(card.name).type));
  return cards.reverse();
}

export function isCardActivated(card: CardModel, player: PublicPlayerModel): boolean {
  return player.actionsThisGeneration.includes(card.name) || card.isDisabled;
}
