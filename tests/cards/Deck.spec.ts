import {expect} from 'chai';
import {PreludeDeck, CeoDeck, ProjectDeck} from '../../src/server/cards/Deck';
import {GameCards} from '../../src/server/GameCards';
import {DEFAULT_GAME_OPTIONS} from '../../src/server/game/GameOptions';
import {ICard} from '../../src/server/cards/ICard';
import {IGame} from '../../src/server/IGame';
import {IProjectCard} from '../../src/server/cards/IProjectCard';
import {CardName} from '../../src/common/cards/CardName';
import {ConstRandom, UnseededRandom} from '../../src/common/utils/Random';
import {testGame} from '../TestGame';
import {fakeCard} from '../TestingUtils';

function name(card: ICard): CardName {
  return card.name;
}

describe('PreludeDeck', () => {
  const random = new UnseededRandom();

  it('addresses incompatible fan preludes', () => {
    const commonGameOptions = {
      ...DEFAULT_GAME_OPTIONS,
      preludeExtension: true,
      turmoilExtension: true,
    };

    function names(deck: PreludeDeck): Array<CardName> {
      return deck.drawPile.map(name);
    }

    const first = new PreludeDeck(new GameCards({...commonGameOptions}).getPreludeCards(), [], random);
    expect(names(first)).does.not.include(CardName.BY_ELECTION);
    expect(names(first)).does.not.include(CardName.THE_NEW_SPACE_RACE);

    const second = new PreludeDeck(new GameCards({...commonGameOptions, communityCardsOption: true}).getPreludeCards(), [], random);
    expect(names(second)).includes(CardName.BY_ELECTION);
    expect(names(second)).does.not.include(CardName.THE_NEW_SPACE_RACE);

    const third = new PreludeDeck(new GameCards({...commonGameOptions, pathfindersExpansion: true}).getPreludeCards(), [], random);
    expect(names(third)).does.not.include(CardName.BY_ELECTION);
    expect(names(third)).includes(CardName.THE_NEW_SPACE_RACE);

    const fourth = new PreludeDeck(
      new GameCards({...commonGameOptions, communityCardsOption: true, pathfindersExpansion: true}).getPreludeCards(), [], new ConstRandom(0));
    expect(names(fourth)).does.not.include(CardName.BY_ELECTION);
    expect(names(fourth)).includes(CardName.THE_NEW_SPACE_RACE);

    const fifth = new PreludeDeck(
      new GameCards({...commonGameOptions, communityCardsOption: true, pathfindersExpansion: true}).getPreludeCards(), [], new ConstRandom(0.5));
    expect(names(fifth)).includes(CardName.BY_ELECTION);
    expect(names(fifth)).does.not.include(CardName.THE_NEW_SPACE_RACE);
  });

  it('serialization compatibility', () => {
    const deck = new PreludeDeck(new GameCards({...DEFAULT_GAME_OPTIONS, venusNextExtension: true, customCorporationsList: [CardName.MERGER]}).getPreludeCards(), [], random);

    const logger = {
      log: () => {},
    };

    deck.discard(deck.drawOrThrow(logger));
    deck.discard(deck.drawOrThrow(logger));

    expect(deck.drawPile).has.length(33);
    expect(deck.discardPile).has.length(2);

    const serialized = deck.serialize();
    expect(serialized.drawPile).has.length(33);
    expect(serialized.discardPile).has.length(2);

    const deserialized = PreludeDeck.deserialize(serialized, UnseededRandom.INSTANCE);
    expect(deserialized.drawPile).has.length(33);
    expect(deserialized.discardPile).has.length(2);

    expect(deck.drawPile).to.deep.eq(deserialized.drawPile);
    expect(deck.discardPile).to.deep.eq(deserialized.discardPile);
  });
});

describe('CeoDeck', () => {
  const random = new UnseededRandom();

  it('serialization compatibility', () => {
    const deck = new CeoDeck(new GameCards(
      {...DEFAULT_GAME_OPTIONS,
        ceoExtension: true,
        preludeExtension: true,
      }).getCeoCards(), [], random);

    const logger = {
      log: () => {},
    };

    // TODO(dl): Once CEOs is deployed, we can hard-value these deckLength checks.
    // But while we're constantly adding CEOs we cannot expect the drawPile to have a static length
    // Instead, I'm getting the length of the deck prior to the draws, and just making sure it shrinks after we draw.
    const drawCardsCount = 3;
    const deckLength = deck.drawPile.length - drawCardsCount;
    for (let i = 0; i < drawCardsCount; i++) {
      deck.discard(deck.drawOrThrow(logger));
    }

    expect(deck.drawPile).has.length(deckLength);
    expect(deck.discardPile).has.length(drawCardsCount);

    const serialized = deck.serialize();
    expect(serialized.drawPile).has.length(deckLength);
    expect(serialized.discardPile).has.length(drawCardsCount);

    const deserialized = CeoDeck.deserialize(serialized, UnseededRandom.INSTANCE);
    expect(deserialized.drawPile).has.length(deckLength);
    expect(deserialized.discardPile).has.length(drawCardsCount);

    expect(deck.drawPile).to.deep.eq(deserialized.drawPile);
    expect(deck.discardPile).to.deep.eq(deserialized.discardPile);
  });
});

describe('draw()', () => {
  let deck: ProjectDeck;
  let game: IGame;
  let drawnCard: IProjectCard | undefined;
  let originalLength: number;
  let topCard: IProjectCard | undefined;
  let bottomCard: IProjectCard | undefined;

  describe('with more than enough cards in the draw pile', () => {
    beforeEach(() => {
      [game] = testGame(2);
      deck = game.projectDeck;
      originalLength = game.projectDeck.drawPile.length;
    });

    describe('drawing from the top', () => {
      beforeEach(() => {
        topCard = deck.drawPile[originalLength - 1];
        drawnCard = deck.draw(game);
      });

      it('should draw the top card', () => {
        expect(drawnCard).to.equal(topCard);
      });

      it('should remove the card from the draw pile', () => {
        expect(deck.drawPile).has.length(originalLength - 1);
      });
    });

    describe('drawing from the bottom', () => {
      beforeEach(() => {
        bottomCard = deck.drawPile[0];
        drawnCard = deck.draw(game, 'bottom');
      });

      it('should draw the bottom card', () => {
        expect(drawnCard).to.equal(bottomCard);
      });

      it('should remove the card from the draw pile', () => {
        expect(deck.drawPile).has.length(originalLength - 1);
      });
    });
  });

  describe('draw from the top with only 1 card left in the draw pile', () => {
    beforeEach(() => {
      [game] = testGame(2);
      deck = game.projectDeck;
      originalLength = game.projectDeck.drawPile.length;
      bottomCard = deck.drawPile[0];

      // move all cards in the draw pile except 1 into discard pile
      const allExceptLast = deck.drawPile.splice(1);
      deck.discardPile.push(...allExceptLast);

      drawnCard = deck.draw(game);
    });

    it('should draw the top card', () => {
      expect(drawnCard).to.equal(bottomCard);
    });

    it('should shuffle the discard pile back into the draw pile', () => {
      expect(deck.drawPile).has.length(originalLength - 1);
      expect(deck.discardPile).has.length(0);
    });
  });

  describe('draw from the top with no cards left in the draw pile', () => {
    let removedCards: IProjectCard[];

    beforeEach(() => {
      [game] = testGame(2);
      deck = game.projectDeck;
      originalLength = game.projectDeck.drawPile.length;
      bottomCard = deck.drawPile[0];

      // remove all draw pile cards
      removedCards = deck.drawPile.splice(0);

      drawnCard = deck.draw(game);
    });

    it('should have an empty discard pile', () => {
      expect(deck.discardPile).has.length(0);
    });

    it('the drawn card should be undefined', () => {
      expect(drawnCard).to.equal(undefined);
    });

    describe('some cards are discarded before drawing from the top again', () => {
      beforeEach(() => {
        deck.discardPile = [...removedCards.splice(0, 11)];

        drawnCard = deck.draw(game);
      });

      it('should draw the new top card', () => {
        expect(drawnCard).to.not.equal(undefined);
      });

      it('should empty the discard pile', () => {
        expect(deck.discardPile).has.length(0);
      });

      it('should have the correct number of remaining cards in the draw pile', () => {
        expect(deck.drawPile).has.length(10);
      });
    });
  });

  it('drawN', () => {
    const [game] = testGame(2);
    expect(game.projectDeck.drawN(game, 3)).to.have.length(3);
    game.projectDeck.drawPile.length = 2;
    expect(game.projectDeck.drawN(game, 3)).to.have.length(2);
    expect(game.projectDeck.drawN(game, 3)).to.have.length(0);
  });

  it('drawNOrThrow', () => {
    const [game] = testGame(2);
    expect(game.projectDeck.drawNOrThrow(game, 3)).to.have.length(3);
    game.projectDeck.drawPile.length = 2;
    expect(() => game.projectDeck.drawNOrThrow(game, 3)).to.throw();
  });

  it('size', () => {
    const [game] = testGame(2);
    game.projectDeck.drawPile.length = 2;
    expect(game.projectDeck.size()).eq(2);
    game.projectDeck.discardPile.push(fakeCard());
    expect(game.projectDeck.size()).eq(3);
  });

  it('canDraw', () => {
    const [game] = testGame(2);
    expect(game.projectDeck.canDraw(3)).is.true;
    game.projectDeck.drawPile.length = 2;
    expect(game.projectDeck.canDraw(3)).is.false;
    game.projectDeck.discardPile.push(fakeCard());
    expect(game.projectDeck.canDraw(3)).is.true;
  });
});
