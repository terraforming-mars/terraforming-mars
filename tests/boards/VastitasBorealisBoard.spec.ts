import {expect} from 'chai';
import {Game} from '../../src/server/Game';
import {VastitasBorealisBoard} from '../../src/server/boards/VastitasBorealisBoard';
import {TileType} from '../../src/common/TileType';
import {TestPlayer} from '../TestPlayer';
import {cast, runAllActions} from '../TestingUtils';
import {BoardName} from '../../src/common/boards/BoardName';
import {SpaceName} from '../../src/server/SpaceName';
import {testGame} from '../TestGame';

describe('VastitasBorealisBoard', function() {
  let board: VastitasBorealisBoard;
  let game: Game;
  let player: TestPlayer;

  beforeEach(function() {
    [game, player] = testGame(2, {boardName: BoardName.VASTITAS_BOREALIS});
    board = cast(game.board, VastitasBorealisBoard);
  });

  it('Grants temperature bonus', () => {
    const space = board.getSpaceOrThrow(SpaceName.VASTITAS_BOREALIS_NORTH_POLE);

    player.megaCredits = 2;
    expect(board.getAvailableSpacesOnLand(player).map((space) => space.id)).does.not.include(SpaceName.VASTITAS_BOREALIS_NORTH_POLE);

    player.megaCredits = 3;
    expect(board.getAvailableSpacesOnLand(player).map((space) => space.id)).includes(SpaceName.VASTITAS_BOREALIS_NORTH_POLE);
    expect(game.getTemperature()).eq(-30);

    game.addTile(player, space, {tileType: TileType.CITY});
    runAllActions(game);

    expect(player.megaCredits).eq(0);
    expect(game.getTemperature()).eq(-28);
  });
});
