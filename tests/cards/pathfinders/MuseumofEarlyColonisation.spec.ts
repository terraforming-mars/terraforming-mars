import {expect} from 'chai';
import {MuseumofEarlyColonisation} from '../../../src/server/cards/pathfinders/MuseumofEarlyColonisation';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {addCity, addGreenery, addOcean} from '../../TestingUtils';
import {TileType} from '../../../src/common/TileType';
import {Units} from '../../../src/common/Units';

describe('MuseumofEarlyColonisation', function() {
  let card: MuseumofEarlyColonisation;
  let player: TestPlayer;
  let player2: TestPlayer;

  beforeEach(function() {
    card = new MuseumofEarlyColonisation();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, player2], player);
  });

  it('canPlay', function() {
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

  it('play', function() {
    player.production.override({energy: 1});
    expect(player.getTerraformRating()).eq(20);

    card.play(player);

    expect(player.production.asUnits()).deep.eq(Units.of({steel: 1, titanium: 1, plants: 1}));
    expect(player.getTerraformRating()).eq(21);
  });
});
