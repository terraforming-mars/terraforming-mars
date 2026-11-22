import {IGame} from '../IGame';

/**
 * Picks one of `options` at random the rulebook way (rulebook A, p.9, tiebreak 3; rulebook C, p.4).
 *
 * The cost of a flipped project card, counted through `options` from the first, picks the option.
 * The card is then discarded.
 *
 * Returns undefined when there are no options or the project deck is empty.
 */
export function pickByFlippedCard<T>(game: IGame, options: ReadonlyArray<T>): T | undefined {
  if (options.length === 0) {
    return undefined;
  }

  const flipped = game.projectDeck.drawN(game, 1);
  if (flipped.length === 0) {
    return undefined;
  }

  const card = flipped[0];
  // Use positive modulo: cost=0 cards (e.g. IndenturedWorkers) would give -1 % N in JS
  const n = options.length;
  const index = ((card.cost - 1) % n + n) % n;
  game.projectDeck.discardPile.push(card);
  game.log('MarsBot reveals ${0} to break a tie', (b) => b.card(card, {cost: true}));

  return options[index];
}
