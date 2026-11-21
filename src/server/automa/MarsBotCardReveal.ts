import {IGame} from '../IGame';

/**
 * Picks one of `options` at random the rulebook way (rulebook A, tiebreak 3; C-15b).
 *
 * Method: reveal 1 card from the project deck; use `(cost - 1) % options.length`
 * to pick the option. Discard the revealed card.
 * Returns undefined when there are no options or the project deck is empty.
 */
export function pickByRevealedCard<T>(game: IGame, options: ReadonlyArray<T>): T | undefined {
  if (options.length === 0) {
    return undefined;
  }

  const revealed = game.projectDeck.drawN(game, 1);
  if (revealed.length === 0) {
    return undefined;
  }

  const card = revealed[0];
  // Use positive modulo: cost=0 cards (e.g. IndenturedWorkers) would give -1 % N in JS
  const n = options.length;
  const index = ((card.cost - 1) % n + n) % n;
  // Discard the revealed card back to the project deck discard pile
  game.projectDeck.discardPile.push(card);
  game.log('MarsBot reveals ${0} to break a tie', (b) => b.card(card, {cost: true}));

  return options[index];
}
