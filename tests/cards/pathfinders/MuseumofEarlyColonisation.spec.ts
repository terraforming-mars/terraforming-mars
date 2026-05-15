import {expect} from 'chai';
import {MuseumofEarlyColonisation} from '../../../src/server/cards/pathfinders/MuseumofEarlyColonisation';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {addCity, addGreenery, addOcean, runAllActions} from '../../TestingUtils';
import {TileType} from '../../../src/common/TileType';
import {Units} from '../../../src/common/Units';
import {IGame} from '../../../src/server/IGame';

describe('MuseumofEarlyColonisation', () => {
  let card: MuseumofEarlyColonisation;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new MuseumofEarlyColonisation();
    [game, player, player2] = testGame(2, {pathfindersExpansion: true});
  });

  it('canPlay', () => {
    const ocean = addOcean(player2);
    const greenery = addGreenery(player2);
    const city = addCity(player2);
    player.production.override({energy: 1});
    expect(card.canPlay(player)).is.true;

    player.production.override({energy: 0});
    expect(card.canPlay(player)).is.false;

    player.production.override({energy: 1});
    expect(card.canPlay(player)).is.true;
    ocean.tile!.tileType = TileType.BIOFERTILIZER_FACILITY;
    expect(card.canPlay(player)).is.false;

    ocean.tile!.tileType = TileType.OCEAN;
    expect(card.canPlay(player)).is.true;
    greenery.tile!.tileType = TileType.BIOFERTILIZER_FACILITY;
    expect(card.canPlay(player)).is.false;

    greenery.tile!.tileType = TileType.GREENERY;
    expect(card.canPlay(player)).is.true;
    city.tile!.tileType = TileType.BIOFERTILIZER_FACILITY;
    expect(card.canPlay(player)).is.false;
  });

  it('play', () => {
    player.production.override({energy: 1});
    expect(player.terraformRating).eq(20);

    card.play(player);
    runAllActions(game);

    expect(player.production.asUnits()).deep.eq(Units.of({steel: 1, titanium: 1, plants: 1}));
    expect(player.terraformRating).eq(21);
  });

  describe('Pathfinders Mars track offset', () => {
    beforeEach(() => {
      addOcean(player2);
      addGreenery(player2);
      addCity(player2);
    });

    it('canPlay false when Mars track advance would not grant energy production', () => {
      game.pathfindersData!.mars = 0;
      expect(card.canPlay(player)).is.false;
    });

    it('canPlay true when Mars track advance lands on energy_production reward', () => {
      game.pathfindersData!.mars = 7;
      expect(card.canPlay(player)).is.true;
    });

    it('playing the card nets zero change to energy production', () => {
      game.pathfindersData!.mars = 7;
      player.playCard(card);
      runAllActions(game);
      expect(player.production.energy).eq(0);
      expect(player.production.steel).eq(1);
      expect(player.production.titanium).eq(1);
      expect(player.production.plants).eq(1);
    });
  });
});
