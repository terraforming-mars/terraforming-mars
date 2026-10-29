import {expect} from 'chai';
import {MarsBotBonusDeck} from '../../src/server/automa/MarsBotBonusDeck';
import {SeededRandom} from '../../src/common/utils/Random';

describe('MarsBotBonusDeck', () => {
  const logger = {log: () => {}};
  let deck: MarsBotBonusDeck;

  beforeEach(() => {
    deck = MarsBotBonusDeck.createBase(new SeededRandom(42));
  });

  it('starts with the 8 base cards in the draw pile', () => {
    expect(deck.drawPile.length).to.eq(8);
    expect(deck.discardPile.length).to.eq(0);
  });

  // Reshuffle when a draw finds the deck empty, by which time the last card is discarded too.
  it('the last card drawn joins the next reshuffle', () => {
    for (let i = 0; i < 7; i++) {
      deck.discard(deck.draw(logger)!);
    }
    const last = deck.draw(logger)!;
    expect(deck.drawPile).is.empty;
    expect(deck.discardPile.length).to.eq(7);

    deck.discard(last);
    deck.draw(logger);
    expect(deck.drawPile.length).to.eq(7);
    expect(deck.discardPile).is.empty;
  });

  it('serialization round trip', () => {
    deck.discard(deck.draw(logger)!, deck.draw(logger)!);
    const restored = MarsBotBonusDeck.deserialize(deck.serialize(), new SeededRandom(42));
    expect(restored.drawPile).to.deep.eq(deck.drawPile);
    expect(restored.discardPile).to.deep.eq(deck.discardPile);
  });
});
