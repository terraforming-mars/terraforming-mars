import {expect} from 'chai';
import {MarsBotBonusDeck} from '../../src/server/automa/MarsBotBonusDeck';
import {SeededRandom} from '../../src/common/utils/Random';

describe('MarsBotBonusDeck', () => {
  let deck: MarsBotBonusDeck;

  beforeEach(() => {
    deck = MarsBotBonusDeck.createBase(new SeededRandom(42));
  });

  it('starts with 8 cards', () => {
    expect(deck.drawPile.length).to.eq(8);
    expect(deck.discardPile.length).to.eq(0);
  });

  it('draws a card', () => {
    const card = deck.draw();
    expect(card).to.not.be.undefined;
    expect(deck.drawPile.length).to.eq(7);
  });

  it('discards a card', () => {
    const card = deck.draw()!;
    deck.discard(card);
    expect(deck.discardPile.length).to.eq(1);
  });

  it('reshuffles discard when draw pile empty', () => {
    // Draw all 8 cards
    const cards = [];
    for (let i = 0; i < 8; i++) {
      cards.push(deck.draw()!);
    }
    expect(deck.drawPile.length).to.eq(0);

    // Discard all
    for (const c of cards) {
      deck.discard(c);
    }
    expect(deck.discardPile.length).to.eq(8);

    // Drawing should reshuffle
    const card = deck.draw();
    expect(card).to.not.be.undefined;
    expect(deck.discardPile.length).to.eq(0);
  });

  it('destroyed cards do not return when reshuffled', () => {
    const card = deck.draw()!;
    deck.destroy(card);
    expect(card.destroyed).to.be.true;

    // Draw and discard remaining 7
    const remaining = [];
    for (let i = 0; i < 7; i++) {
      remaining.push(deck.draw()!);
    }
    for (const c of remaining) {
      deck.discard(c);
    }

    // Reshuffle and draw all — should get 7, not 8
    const reshuffled = [];
    for (let i = 0; i < 10; i++) {
      const c = deck.draw();
      if (c === undefined) {
        break;
      }
      reshuffled.push(c);
      deck.discard(c);
    }
    // Should never see the destroyed card
    expect(reshuffled.every((c) => c.id !== card.id)).to.be.true;
  });
});
