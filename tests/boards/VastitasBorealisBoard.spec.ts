import {expect} from 'chai';
import {DEFAULT_GAME_OPTIONS, Game} from '../../src/Game';
import {VastitasBorealisBoard} from '../../src/boards/VastitasBorealisBoard';
import {Player} from '../../src/Player';
import {TileType} from '../../src/common/TileType';
import {TestPlayers} from '../TestPlayers';
import {Random} from '../../src/Random';
import {TestingUtils} from '../TestingUtils';
import {BoardName} from '../../src/common/boards/BoardName';
import {SpaceName} from '../../src/SpaceName';

describe('VastitasBorealisBoard', function() {
  let board : VastitasBorealisBoard;
  let game: Game;
  let player : Player;
  let player2 : Player;

  beforeEach(function() {
    board = VastitasBorealisBoard.newInstance(DEFAULT_GAME_OPTIONS, new Random(0));
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('x', [player, player2], player, TestingUtils.setCustomGameOptions({boardName: BoardName.ARABIA_TERRA}));
  });

  it('Grants temperature bonus', () => {
    const space = board.getSpace(SpaceName.VASTITAS_BOREALIS_NORTH_POLE);

    player.megaCredits = 2;
    expect(board.getAvailableSpacesOnLand(player).map((space) => space.id)).does.not.include(SpaceName.VASTITAS_BOREALIS_NORTH_POLE);

    player.megaCredits = 3;
    expect(board.getAvailableSpacesOnLand(player).map((space) => space.id)).includes(SpaceName.VASTITAS_BOREALIS_NORTH_POLE);
    expect(game.getTemperature()).eq(-30);

    game.addTile(player, space.spaceType, space, {tileType: TileType.CITY});
    TestingUtils.runAllActions(game);

    expect(player.megaCredits).eq(0);
    expect(game.getTemperature()).eq(-28);
  });
});
