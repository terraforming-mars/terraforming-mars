import {expect} from 'chai';
import {PreludeDeck} from '../../src/server/cards/Deck';
import {GameCards} from '../../src/server/GameCards';
import {DEFAULT_GAME_OPTIONS} from '../../src/server/GameOptions';
import {CardName} from '../../src/common/cards/CardName';
import {ConstRandom, UnseededRandom} from '../../src/server/Random';
import {ICard} from '../../src/server/cards/ICard';

function name(card: ICard): CardName {
  return card.name;
}

describe('PreludeDeck', function() {
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

    deck.discard(deck.draw(logger));
    deck.discard(deck.draw(logger));

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
