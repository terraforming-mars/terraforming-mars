import {expect} from 'chai';
// import {Dealer} from '../../src/server/Dealer';
import {PreludeDeck} from '../../src/server/cards/Deck';
// import {setCustomGameOptions} from '../TestingUtils';
import {GameCards} from '../../src/server/GameCards';
import {DEFAULT_GAME_OPTIONS} from '../../src/server/GameOptions';
import {CardName} from '../../src/common/cards/CardName';
import {ConstRandom, UnseededRandom} from '../../src/server/Random';

describe('Deck', function() {
  // it('deserializes from serialized', () => {
  //   const gameOptions = setCustomGameOptions({
  //     corporateEra: false,
  //     preludeExtension: true,
  //     venusNextExtension: false,
  //     coloniesExtension: true,
  //     turmoilExtension: false,
  //     promoCardsOption: true,
  //     communityCardsOption: false,
  //     aresExtension: true,
  //   });
  //   const dealer = Dealer.newInstance(new GameCards(gameOptions));
  //   expect(dealer).to.deep.eq(Dealer.deserialize(dealer.serialize()));
  // });
});

describe('PreludeDeck', function() {
  const random = new UnseededRandom();

  it('addresses incompatible fan preludes', () => {
    const commonGameOptions = {
      ...DEFAULT_GAME_OPTIONS,
      preludeExtension: true,
      turmoilExtension: true,
    };

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
    expect(deck).to.deep.eq(PreludeDeck.deserialize(deck.serialize()));

    deck.deal
  });
});

function names(deck: PreludeDeck): Array<CardName> {
  return deck.drawPile.map((card) => card.name);
}
