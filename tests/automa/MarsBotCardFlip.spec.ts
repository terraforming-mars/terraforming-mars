import {expect} from 'chai';
import {testGame} from '../TestGame';
import {IGame} from '@/server/IGame';
import {pickByFlippedCard} from '@/server/automa/MarsBotCardFlip';
import {Capital} from '@/server/cards/base/Capital';
import {IndenturedWorkers} from '@/server/cards/base/IndenturedWorkers';

describe('MarsBotCardFlip', () => {
  let game: IGame;

  beforeEach(() => {
    [game] = testGame(1);
  });

  it('counts through the options by the flipped card cost', () => {
    game.projectDeck.drawPile.push(new Capital());

    // Capital costs 26, so (26 - 1) % 4 = 1 picks the second option.
    expect(pickByFlippedCard(game, ['a', 'b', 'c', 'd'])).eq('b');
  });

  it('discards the flipped card', () => {
    const capital = new Capital();
    game.projectDeck.drawPile.push(capital);
    const drawn = game.projectDeck.drawPile.length;
    const discarded = game.projectDeck.discardPile.length;

    pickByFlippedCard(game, ['a', 'b']);

    expect(game.projectDeck.drawPile.length).eq(drawn - 1);
    expect(game.projectDeck.discardPile.length).eq(discarded + 1);
    expect(game.projectDeck.discardPile.at(-1)).eq(capital);
  });

  it('wraps a card that costs nothing to the last option', () => {
    game.projectDeck.drawPile.push(new IndenturedWorkers());

    expect(pickByFlippedCard(game, ['a', 'b', 'c'])).eq('c');
  });

  it('returns undefined without options and keeps the deck as it is', () => {
    const drawn = game.projectDeck.drawPile.length;

    expect(pickByFlippedCard(game, [])).is.undefined;

    expect(game.projectDeck.drawPile.length).eq(drawn);
  });

  it('returns undefined when the project deck is empty', () => {
    game.projectDeck.drawPile.length = 0;
    game.projectDeck.discardPile.length = 0;

    expect(pickByFlippedCard(game, ['a', 'b'])).is.undefined;
  });
});
