import {ICard} from '../cards/ICard';
import {IGame} from '../IGame';
import {IPlayer} from '../IPlayer';

export function hasRevealedHiddenInformation(currentGame: IGame, restoredGame: IGame, player: IPlayer): boolean {
  if (hasDeckDrawPileChanged(currentGame, restoredGame)) {
    return true;
  }

  for (const currentPlayer of currentGame.players) {
    const restoredPlayer = restoredGame.players.find((candidate) => candidate.id === currentPlayer.id);
    if (restoredPlayer === undefined) {
      return true;
    }
    if (hasNewPrivateCards(currentPlayer, restoredPlayer)) {
      return true;
    }
  }

  return waitingForShowsUnknownCards(player, restoredGame);
}

function hasDeckDrawPileChanged(currentGame: IGame, restoredGame: IGame): boolean {
  return cardNames(currentGame.projectDeck.drawPile).join('|') !== cardNames(restoredGame.projectDeck.drawPile).join('|') ||
    cardNames(currentGame.preludeDeck.drawPile).join('|') !== cardNames(restoredGame.preludeDeck.drawPile).join('|') ||
    cardNames(currentGame.corporationDeck.drawPile).join('|') !== cardNames(restoredGame.corporationDeck.drawPile).join('|') ||
    cardNames(currentGame.ceoDeck.drawPile).join('|') !== cardNames(restoredGame.ceoDeck.drawPile).join('|');
}

function hasNewPrivateCards(currentPlayer: IPlayer, restoredPlayer: IPlayer): boolean {
  return hasAddedCards(currentPlayer.cardsInHand, restoredPlayer.cardsInHand) ||
    hasAddedCards(currentPlayer.dealtProjectCards, restoredPlayer.dealtProjectCards) ||
    hasAddedCards(currentPlayer.draftHand, restoredPlayer.draftHand) ||
    hasAddedCards(currentPlayer.draftedCards, restoredPlayer.draftedCards) ||
    hasAddedCards(currentPlayer.preludeCardsInHand, restoredPlayer.preludeCardsInHand) ||
    hasAddedCards(Array.from(currentPlayer.ceoCardsInHand), Array.from(restoredPlayer.ceoCardsInHand)) ||
    hasAddedCards(currentPlayer.dealtCorporationCards, restoredPlayer.dealtCorporationCards) ||
    hasAddedCards(currentPlayer.dealtPreludeCards, restoredPlayer.dealtPreludeCards) ||
    hasAddedCards(currentPlayer.dealtCeoCards, restoredPlayer.dealtCeoCards);
}

function hasAddedCards(currentCards: ReadonlyArray<ICard>, restoredCards: ReadonlyArray<ICard>): boolean {
  const restoredCounts = countCards(restoredCards);
  for (const card of currentCards) {
    const count = restoredCounts.get(card.name) ?? 0;
    if (count === 0) {
      return true;
    }
    restoredCounts.set(card.name, count - 1);
  }
  return false;
}

function waitingForShowsUnknownCards(player: IPlayer, restoredGame: IGame): boolean {
  const waitingForModel = player.getWaitingFor()?.toModel(player);
  if (waitingForModel === undefined || !('cards' in waitingForModel)) {
    return false;
  }

  const knownCards = new Set<string>();
  for (const candidate of restoredGame.players) {
    for (const cardName of cardNames(candidate.tableau.asArray())) {
      knownCards.add(cardName);
    }
  }

  const restoredPlayer = restoredGame.getPlayerById(player.id);
  for (const cardName of [
    ...cardNames(restoredPlayer.cardsInHand),
    ...cardNames(restoredPlayer.dealtProjectCards),
    ...cardNames(restoredPlayer.draftHand),
    ...cardNames(restoredPlayer.draftedCards),
    ...cardNames(restoredPlayer.preludeCardsInHand),
    ...cardNames(Array.from(restoredPlayer.ceoCardsInHand)),
    ...cardNames(restoredPlayer.dealtCorporationCards),
    ...cardNames(restoredPlayer.dealtPreludeCards),
    ...cardNames(restoredPlayer.dealtCeoCards),
  ]) {
    knownCards.add(cardName);
  }

  return waitingForModel.cards.some((card) => !knownCards.has(card.name));
}

function countCards(cards: ReadonlyArray<ICard>): Map<string, number> {
  const counts = new Map<string, number>();
  for (const card of cards) {
    counts.set(card.name, (counts.get(card.name) ?? 0) + 1);
  }
  return counts;
}

function cardNames(cards: ReadonlyArray<ICard>): Array<string> {
  return cards.map((card) => card.name);
}
