import {expect} from 'chai';
import {Game} from '../../src/server/Game';
import {DEFAULT_GAME_OPTIONS} from '../../src/server/GameOptions';
import {VastitasBorealisBoard} from '../../src/server/boards/VastitasBorealisBoard';
import {Player} from '../../src/server/Player';
import {TileType} from '../../src/common/TileType';
import {TestPlayer} from '../TestPlayer';
import {SeededRandom} from '../../src/server/Random';
import {testGameOptions, runAllActions} from '../TestingUtils';
import {BoardName} from '../../src/common/boards/BoardName';
import {SpaceName} from '../../src/server/SpaceName';

describe('VastitasBorealisBoard', function() {
  let board: VastitasBorealisBoard;
  let game: Game;
  let player: Player;
  let player2: Player;

  beforeEach(function() {
    board = VastitasBorealisBoard.newInstance(DEFAULT_GAME_OPTIONS, new SeededRandom(0));
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, player2], player, testGameOptions({boardName: BoardName.ARABIA_TERRA}));
  });

  it('Grants temperature bonus', () => {
    const space = board.getSpace(SpaceName.VASTITAS_BOREALIS_NORTH_POLE);

    player.megaCredits = 2;
    expect(board.getAvailableSpacesOnLand(player).map((space) => space.id)).does.not.include(SpaceName.VASTITAS_BOREALIS_NORTH_POLE);

    player.megaCredits = 3;
    expect(board.getAvailableSpacesOnLand(player).map((space) => space.id)).includes(SpaceName.VASTITAS_BOREALIS_NORTH_POLE);
    expect(game.getTemperature()).eq(-30);

    game.addTile(player, space.spaceType, space, {tileType: TileType.CITY});
    runAllActions(game);

    expect(player.megaCredits).eq(0);
    expect(game.getTemperature()).eq(-28);
  });
});
