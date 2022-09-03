import {expect} from 'chai';
import {ArtificialLake} from '../../../src/server/cards/base/ArtificialLake';
import * as constants from '../../../src/common/constants';
import {Game} from '../../../src/server/Game';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TestPlayer} from '../../TestPlayer';
import {SpaceType} from '../../../src/common/boards/SpaceType';
import {TileType} from '../../../src/common/TileType';
import {cast, maxOutOceans} from '../../TestingUtils';

describe('ArtificialLake', function() {
  let card: ArtificialLake;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new ArtificialLake();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not play', function() {
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    const action = cast(card.play(player), SelectSpace);

    action.availableSpaces.forEach((space) => {
      expect(space.spaceType).to.eq(SpaceType.LAND);
    });

    action.cb(action!.availableSpaces[0]);
    const placedTile = action.availableSpaces[0].tile;
    expect(placedTile!.tileType).to.eq(TileType.OCEAN);

    expect(card.getVictoryPoints()).to.eq(1);
  });

  it('Cannot place ocean if all oceans are already placed', function() {
    // Set temperature level to fit requirements
    (game as any).temperature = -6;

    // Set oceans count to the max value
    for (const space of game.board.getSpaces(SpaceType.OCEAN, player)) {
      if (game.board.getOceanCount() < constants.MAX_OCEAN_TILES) {
        game.addOceanTile(player, space.id);
      }
    }

    // Card is still playable to get VPs...
    expect(player.canPlayIgnoringCost(card)).is.true;

    // ...but an action to place ocean is not unavailable
    const action = card.play(player);
    expect(action).is.undefined;
  });

  it('Cannot place ocean if all land spaces are occupied', function() {
    // Set temperature level to fit requirements
    (game as any).temperature = -6;

    // Take all but one space.
    const spaces = game.board.getAvailableSpacesOnLand(player);
    spaces.forEach((space, idx) => {
      if (idx !== 0) game.simpleAddTile(player, space, {tileType: TileType.GREENERY});
    });

    expect(game.board.getAvailableSpacesOnLand(player)).has.length(1);

    // Card is still playable.
    expect(player.canPlayIgnoringCost(card)).is.true;

    // No spaces left?
    game.simpleAddTile(player, spaces[0], {tileType: TileType.GREENERY});
    expect(game.board.getAvailableSpacesOnLand(player)).has.length(0);

    // Cannot play.
    expect(player.canPlayIgnoringCost(card)).is.false;
  });

  it('Can still play if oceans are maxed but no land spaces are available', function() {
    (game as any).temperature = -6;
    maxOutOceans(player);

    // Take all land spaces
    const spaces = game.board.getAvailableSpacesOnLand(player);
    spaces.forEach((space) => {
      game.simpleAddTile(player, space, {tileType: TileType.GREENERY});
    });

    expect(player.canPlayIgnoringCost(card)).is.true;
  });
});
