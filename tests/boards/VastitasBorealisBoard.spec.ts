import {expect} from 'chai';
import {IGame} from '../../src/server/IGame';
import {VastitasBorealisBoard} from '../../src/server/boards/VastitasBorealisBoard';
import {TileType} from '../../src/common/TileType';
import {TestPlayer} from '../TestPlayer';
import {runAllActions} from '../TestingUtils';
import {BoardName} from '../../src/common/boards/BoardName';
import {SpaceName} from '../../src/common/boards/SpaceName';
import {testGame} from '../TestGame';
import {DEFAULT_GAME_OPTIONS} from '../../src/server/game/GameOptions';
import {SeededRandom} from '../../src/common/utils/Random';
import {toID} from '../../src/common/utils/utils';
import {cast} from '../../src/common/utils/utils';

describe('VastitasBorealisBoard', () => {
  let board: VastitasBorealisBoard;
  let game: IGame;
  let player: TestPlayer;

  beforeEach(() => {
    [game, player] = testGame(2, {boardName: BoardName.VASTITAS_BOREALIS});
    board = cast(game.board, VastitasBorealisBoard);
  });

  it('sanity test', () => {
    const board = VastitasBorealisBoard.newInstance(DEFAULT_GAME_OPTIONS, new SeededRandom(0));
    expect(board.spaces).to.deep.eq([
      {id: 'c01', spaceType: 'colony', x: -1, y: -1, bonus: [], edge: false},
      {id: 'c02', spaceType: 'colony', x: -1, y: -1, bonus: [], edge: false},
      {id: '03', spaceType: 'land', x: 4, y: 0, bonus: [1, 1], edge: true},
      {id: '04', spaceType: 'land', x: 5, y: 0, bonus: [2], edge: true},
      {id: '05', spaceType: 'land', x: 6, y: 0, bonus: [], edge: true},
      {id: '06', spaceType: 'land', x: 7, y: 0, bonus: [], edge: true},
      {id: '07', spaceType: 'land', x: 8, y: 0, bonus: [0, 0], edge: true, volcanic: true},
      {id: '08', spaceType: 'land', x: 3, y: 1, bonus: [1, 1], edge: true},
      {id: '09', spaceType: 'land', x: 4, y: 1, bonus: [1], edge: false},
      {id: '10', spaceType: 'land', x: 5, y: 1, bonus: [], edge: false},
      {id: '11', spaceType: 'land', x: 6, y: 1, bonus: [], edge: false},
      {id: '12', spaceType: 'land', x: 7, y: 1, bonus: [0], edge: false, volcanic: true},
      {id: '13', spaceType: 'land', x: 8, y: 1, bonus: [2], edge: true},
      {id: '14', spaceType: 'land', x: 2, y: 2, bonus: [0], edge: true},
      {id: '15', spaceType: 'land', x: 3, y: 2, bonus: [], edge: false},
      {id: '16', spaceType: 'land', x: 4, y: 2, bonus: [], edge: false},
      {id: '17', spaceType: 'land', x: 5, y: 2, bonus: [], edge: false},
      {id: '18', spaceType: 'land', x: 6, y: 2, bonus: [3], edge: false},
      {id: '19', spaceType: 'ocean', x: 7, y: 2, bonus: [2, 3], edge: false},
      {id: '20', spaceType: 'ocean', x: 8, y: 2, bonus: [2], edge: true},
      {id: '21', spaceType: 'land', x: 1, y: 3, bonus: [1, 0], edge: true, volcanic: true},
      {id: '22', spaceType: 'land', x: 2, y: 3, bonus: [1, 3], edge: false, volcanic: true},
      {id: '23', spaceType: 'land', x: 3, y: 3, bonus: [1], edge: false},
      {id: '24', spaceType: 'ocean', x: 4, y: 3, bonus: [4, 4], edge: false},
      {id: '25', spaceType: 'ocean', x: 5, y: 3, bonus: [4, 4], edge: false},
      {id: '26', spaceType: 'ocean', x: 6, y: 3, bonus: [], edge: false},
      {id: '27', spaceType: 'ocean', x: 7, y: 3, bonus: [2, 2], edge: false},
      {id: '28', spaceType: 'land', x: 8, y: 3, bonus: [1, 2], edge: true},
      {id: '29', spaceType: 'land', x: 0, y: 4, bonus: [], edge: true},
      {id: '30', spaceType: 'land', x: 1, y: 4, bonus: [], edge: false},
      {id: '31', spaceType: 'land', x: 2, y: 4, bonus: [], edge: false},
      {id: '32', spaceType: 'ocean', x: 3, y: 4, bonus: [4, 4], edge: false},
      {id: '33', spaceType: 'land', x: 4, y: 4, bonus: [18], edge: false},
      {id: '34', spaceType: 'land', x: 5, y: 4, bonus: [1], edge: false},
      {id: '35', spaceType: 'land', x: 6, y: 4, bonus: [], edge: false},
      {id: '36', spaceType: 'land', x: 7, y: 4, bonus: [2], edge: false},
      {id: '37', spaceType: 'ocean', x: 8, y: 4, bonus: [0], edge: true},
      {id: '38', spaceType: 'land', x: 1, y: 5, bonus: [2], edge: true},
      {id: '39', spaceType: 'land', x: 2, y: 5, bonus: [], edge: false},
      {id: '40', spaceType: 'land', x: 3, y: 5, bonus: [2], edge: false},
      {id: '41', spaceType: 'ocean', x: 4, y: 5, bonus: [4, 4], edge: false},
      {id: '42', spaceType: 'land', x: 5, y: 5, bonus: [4, 4], edge: false},
      {id: '43', spaceType: 'land', x: 6, y: 5, bonus: [], edge: false},
      {id: '44', spaceType: 'land', x: 7, y: 5, bonus: [2], edge: false},
      {id: '45', spaceType: 'land', x: 8, y: 5, bonus: [0, 2], edge: true},
      {id: '46', spaceType: 'land', x: 2, y: 6, bonus: [2, 2], edge: true},
      {id: '47', spaceType: 'land', x: 3, y: 6, bonus: [], edge: false},
      {id: '48', spaceType: 'ocean', x: 4, y: 6, bonus: [], edge: false},
      {id: '49', spaceType: 'land', x: 5, y: 6, bonus: [], edge: false},
      {id: '50', spaceType: 'land', x: 6, y: 6, bonus: [1, 2], edge: false},
      {id: '51', spaceType: 'land', x: 7, y: 6, bonus: [2], edge: false},
      {id: '52', spaceType: 'land', x: 8, y: 6, bonus: [2, 2], edge: true},
      {id: '53', spaceType: 'ocean', x: 3, y: 7, bonus: [2], edge: true},
      {id: '54', spaceType: 'land', x: 4, y: 7, bonus: [], edge: false},
      {id: '55', spaceType: 'land', x: 5, y: 7, bonus: [3], edge: false},
      {id: '56', spaceType: 'land', x: 6, y: 7, bonus: [1], edge: false},
      {id: '57', spaceType: 'land', x: 7, y: 7, bonus: [], edge: false},
      {id: '58', spaceType: 'land', x: 8, y: 7, bonus: [2, 2], edge: true},
      {id: '59', spaceType: 'ocean', x: 4, y: 8, bonus: [2, 2], edge: true},
      {id: '60', spaceType: 'land', x: 5, y: 8, bonus: [], edge: true},
      {id: '61', spaceType: 'land', x: 6, y: 8, bonus: [2], edge: true},
      {id: '62', spaceType: 'land', x: 7, y: 8, bonus: [2, 2], edge: true},
      {id: '63', spaceType: 'land', x: 8, y: 8, bonus: [1, 2], edge: true},
    ]);
    expect(board.volcanicSpaceIds).deep.eq(['07', '12', '21', '22']);
  });

  it('Grants temperature bonus', () => {
    const space = board.getSpaceOrThrow(SpaceName.VASTITAS_BOREALIS_NORTH_POLE);

    player.megaCredits = 3;
    expect(board.getAvailableSpacesOnLand(player).map(toID)).does.not.include(SpaceName.VASTITAS_BOREALIS_NORTH_POLE);

    player.megaCredits = 4;
    expect(board.getAvailableSpacesOnLand(player).map(toID)).includes(SpaceName.VASTITAS_BOREALIS_NORTH_POLE);
    expect(game.getTemperature()).eq(-30);

    game.addTile(player, space, {tileType: TileType.CITY});
    runAllActions(game);

    expect(player.megaCredits).eq(0);
    expect(game.getTemperature()).eq(-28);
  });
});
