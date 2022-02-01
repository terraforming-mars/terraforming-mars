import {expect} from 'chai';
import {Game} from '../../src/Game';
import {CosmicSettler} from '../../src/awards/CosmicSettler';
import {SpaceType} from '../../src/common/boards/SpaceType';
import {TestPlayers} from '../TestPlayers';
import {TestPlayer} from '../TestPlayer';
import {Board} from '../../src/boards/Board';
import {TileType} from '../../src/common/TileType';

describe('CosmicSettler', function() {
  let award : CosmicSettler;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;
  let board: Board;

  beforeEach(function() {
    award = new CosmicSettler();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('id', [player, player2], player);
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
