import {expect} from 'chai';
import {MarsBotBonusDeck} from '../../src/server/automa/MarsBotBonusDeck';
import {SeededRandom} from '../../src/common/utils/Random';

describe('MarsBotBonusDeck', () => {
  let deck: MarsBotBonusDeck;

  beforeEach(() => {
    deck = MarsBotBonusDeck.createBase(new SeededRandom(42));
  });

  it('starts with the 8 base cards in the draw pile', () => {
    expect(deck.drawPile.length).to.eq(8);
    expect(deck.discardPile.length).to.eq(0);
  });

  it('draws a card off the draw pile', () => {
    const card = deck.draw();
    expect(card).to.not.be.undefined;
    expect(deck.drawPile.length).to.eq(7);
  });

  it('discards a card to the discard pile', () => {
    const card = deck.draw()!;
    deck.discard(card);
    expect(deck.discardPile.length).to.eq(1);
  });

  it('reshuffles the discard pile when the draw pile is empty', () => {
    const drawn = [];
    for (let i = 0; i < 8; i++) {
      drawn.push(deck.draw()!);
    }
    expect(deck.drawPile.length).to.eq(0);

    for (const card of drawn) {
      deck.discard(card);
    }
    expect(deck.discardPile.length).to.eq(8);

    const card = deck.draw();
    expect(card).to.not.be.undefined;
    expect(deck.discardPile.length).to.eq(0);
    expect(deck.drawPile.length).to.eq(7);
  });
});
