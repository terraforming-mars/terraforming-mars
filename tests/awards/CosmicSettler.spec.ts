import {expect} from 'chai';
import {IGame} from '../../src/server/IGame';
import {CosmicSettler} from '../../src/server/awards/CosmicSettler';
import {SpaceType} from '../../src/common/boards/SpaceType';
import {TestPlayer} from '../TestPlayer';
import {Board} from '../../src/server/boards/Board';
import {TileType} from '../../src/common/TileType';
import {testGame} from '../TestGame';

describe('CosmicSettler', function() {
  let award : CosmicSettler;
  let player: TestPlayer;
  let game: IGame;
  let board: Board;

  beforeEach(function() {
    award = new CosmicSettler();
    [game, player] = testGame(2);
    board = game.board;
  });

  it('Applies to cities in the sky', function() {
    const colonySpaces = board.getSpaces(SpaceType.COLONY, player);
    const landSpaces = board.getAvailableSpacesOnLand(player);

    game.simpleAddTile(player, landSpaces[0], {tileType: TileType.GREENERY});
    game.simpleAddTile(player, landSpaces[0], {tileType: TileType.CITY});
    game.simpleAddTile(player, landSpaces[0], {tileType: TileType.CAPITAL});
    expect(award.getScore(player)).eq(0);

    game.simpleAddTile(player, colonySpaces[0], {tileType: TileType.CITY});
    expect(award.getScore(player)).eq(1);

    game.simpleAddTile(player, colonySpaces[1], {tileType: TileType.CITY});
    expect(award.getScore(player)).eq(2);

    // Doesn't really happen, but stick with me. Forest In Space.
    game.simpleAddTile(player, colonySpaces[2], {tileType: TileType.GREENERY});
    expect(award.getScore(player)).eq(2);
  });
});
