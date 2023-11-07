import {expect} from 'chai';
import {ArtificialLake} from '../../../src/server/cards/base/ArtificialLake';
import * as constants from '../../../src/common/constants';
import {Game} from '../../../src/server/Game';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TestPlayer} from '../../TestPlayer';
import {SpaceType} from '../../../src/common/boards/SpaceType';
import {TileType} from '../../../src/common/TileType';
import {cast, maxOutOceans, runAllActions, setTemperature} from '../../TestingUtils';
import {testGame} from '../../TestGame';
import {UnderworldTestHelper} from '../../underworld/UnderworldTestHelper';

describe('ArtificialLake', function() {
  let card: ArtificialLake;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new ArtificialLake();
    [game, player] = testGame(2);
  });

  it('Can not play', function() {
    expect(player.simpleCanPlay(card)).is.not.true;
  });

  it('Should play', function() {
    expect(card.play(player)).is.undefined;
    runAllActions(game);

    const selectSpace = cast(player.popWaitingFor(), SelectSpace);
    selectSpace.spaces.forEach((space) => {
      expect(space.spaceType).to.eq(SpaceType.LAND);
    });

    UnderworldTestHelper.assertPlaceOcean(player, selectSpace);

    expect(card.getVictoryPoints(player)).to.eq(1);
  });

  it('Cannot place ocean if all oceans are already placed', function() {
    // Set temperature level to fit requirements
    setTemperature(game, -6);

    // Set oceans count to the max value
    for (const space of game.board.getSpaces(SpaceType.OCEAN, player)) {
      if (game.board.getOceanSpaces().length < constants.MAX_OCEAN_TILES) {
        game.addOcean(player, space);
      }
    }

    // Card is still playable to get VPs...
    expect(player.simpleCanPlay(card)).is.true;

    // ...but an action to place ocean is not unavailable
    cast(card.play(player), undefined);
  });

  it('Cannot place ocean if all land spaces are occupied', function() {
    // Set temperature level to fit requirements
    setTemperature(game, -6);

    // Take all but one space.
    const spaces = game.board.getAvailableSpacesOnLand(player);
    spaces.forEach((space, idx) => {
      if (idx !== 0) game.simpleAddTile(player, space, {tileType: TileType.GREENERY});
    });

    expect(game.board.getAvailableSpacesOnLand(player)).has.length(1);

    // Card is still playable.
    expect(player.simpleCanPlay(card)).is.true;

    // No spaces left?
    game.simpleAddTile(player, spaces[0], {tileType: TileType.GREENERY});
    expect(game.board.getAvailableSpacesOnLand(player)).has.length(0);

    // Cannot play.
    expect(player.simpleCanPlay(card)).is.false;
  });

  it('Can still play if oceans are maxed but no land spaces are available', function() {
    setTemperature(game, -6);
    maxOutOceans(player);

    // Take all land spaces
    const spaces = game.board.getAvailableSpacesOnLand(player);
    spaces.forEach((space) => {
      game.simpleAddTile(player, space, {tileType: TileType.GREENERY});
    });

    expect(player.simpleCanPlay(card)).is.true;
  });
});
