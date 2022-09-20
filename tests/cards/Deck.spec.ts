import {expect} from 'chai';
// import {Dealer} from '../../src/server/Dealer';
import {PreludeDeck} from '../../src/server/cards/Deck';
// import {setCustomGameOptions} from '../TestingUtils';
import {GameCards} from '../../src/server/GameCards';
import {DEFAULT_GAME_OPTIONS} from '../../src/server/GameOptions';
import {CardName} from '../../src/common/cards/CardName';
import {ConstRandom, UnseededRandom} from '../../src/server/Random';
import {newTestGame} from '../TestGame';
import {Game} from '../../src/server/Game';
import {ICard} from '../../src/server/cards/ICard';
import {Dealer} from '../../src/server/Dealer';

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

  it('deserializing game with a Dealer', () => {
    const game = newTestGame(1);
    const serialized = game.serialize();
    serialized.projectDeck = undefined;
    serialized.preludeDeck = undefined;
    serialized.corporationDeck = undefined;
    serialized.dealer = {
      corporationCards: [
        CardName.CREDICOR,
        CardName.ECOLINE,
        CardName.HELION,
        CardName.INTERPLANETARY_CINEMATICS,
        CardName.INVENTRIX,
        CardName.VITOR,
      ],
      deck: [
        CardName.GREAT_DAM,
        CardName.SUBTERRANEAN_RESERVOIR,
        CardName.LAKE_MARINERIS,
        CardName.NOCTIS_CITY,
        CardName.COMET,
        CardName.GREENHOUSES,
        CardName.OPEN_CITY,
        CardName.MOSS,
        CardName.BIRDS,
      ],
      discarded: [
        CardName.EOS_CHASMA_NATIONAL_PARK,
        CardName.SMALL_ANIMALS,
        CardName.FISH,
        CardName.BUSINESS_NETWORK,
        CardName.IO_MINING_INDUSTRIES,
      ],
      preludeDeck: [
        CardName.SMELTING_PLANT,
        CardName.POLAR_INDUSTRIES,
        CardName.BIOLAB,
        CardName.ECOLOGY_EXPERTS,
        CardName.LOAN,
        CardName.MOHOLE_EXCAVATION,
        CardName.SELF_SUFFICIENT_SETTLEMENT,
      ],
    };
    const game2 = Game.deserialize(serialized);
    expect(game2.hasOwnProperty('dealer')).is.false;

    expect(game2.projectDeck.drawPile.map(name)).deep.eq([
      CardName.GREAT_DAM,
      CardName.SUBTERRANEAN_RESERVOIR,
      CardName.LAKE_MARINERIS,
      CardName.NOCTIS_CITY,
      CardName.COMET,
      CardName.GREENHOUSES,
      CardName.OPEN_CITY,
      CardName.MOSS,
      CardName.BIRDS,
    ]);
    expect(game2.projectDeck.discardPile.map(name)).deep.eq([
      CardName.EOS_CHASMA_NATIONAL_PARK,
      CardName.SMALL_ANIMALS,
      CardName.FISH,
      CardName.BUSINESS_NETWORK,
      CardName.IO_MINING_INDUSTRIES,
    ]);

    expect(game2.corporationDeck.drawPile.map(name)).deep.eq([
      CardName.CREDICOR,
      CardName.ECOLINE,
      CardName.HELION,
      CardName.INTERPLANETARY_CINEMATICS,
      CardName.INVENTRIX,
      CardName.VITOR]);
    expect(game2.corporationDeck.discardPile).is.empty;

    expect(game2.preludeDeck.drawPile.map(name)).deep.eq([
      CardName.SMELTING_PLANT,
      CardName.POLAR_INDUSTRIES,
      CardName.BIOLAB,
      CardName.ECOLOGY_EXPERTS,
      CardName.LOAN,
      CardName.MOHOLE_EXCAVATION,
      CardName.SELF_SUFFICIENT_SETTLEMENT,
    ]);
    expect(game2.preludeDeck.discardPile).is.empty;

    const dealer = Dealer.deserialize(serialized.dealer);
    expect(dealer.dealCard(game).name).eq(CardName.BIRDS);
    expect(game2.projectDeck.draw(game).name).eq(CardName.BIRDS);

    expect(dealer.dealPreludeCard().name).eq(CardName.SELF_SUFFICIENT_SETTLEMENT);
    expect(game2.preludeDeck.draw(game).name).eq(CardName.SELF_SUFFICIENT_SETTLEMENT);
  });
});
