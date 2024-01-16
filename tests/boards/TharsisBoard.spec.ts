import {DEFAULT_GAME_OPTIONS} from '../../src/server/game/GameOptions';
import {expect} from 'chai';
import {TharsisBoard} from '../../src/server/boards/TharsisBoard';
import {SeededRandom} from '../../src/common/utils/Random';
import {SpaceType} from '../../src/common/boards/SpaceType';
import {SpaceId} from '../../src/common/Types';

describe('TharsisBoard', function() {
  it('has error with input while calling getAdjacentSpaces', function() {
    const board = TharsisBoard.newInstance(DEFAULT_GAME_OPTIONS, new SeededRandom(0));
    expect(function() {
      board.getAdjacentSpaces({
        x: 0,
        y: 0,
        bonus: [],
        id: 'foobar' as SpaceId,
        spaceType: SpaceType.LAND,
      });
    }).to.throw('Unexpected space ID foobar');
  });

  it('sanity test', function() {
    const board = TharsisBoard.newInstance(DEFAULT_GAME_OPTIONS, new SeededRandom(0));
    expect(board.spaces).to.deep.eq([
      {id: '01', spaceType: 'colony', bonus: [], x: -1, y: -1},
      {id: '02', spaceType: 'colony', bonus: [], x: -1, y: -1},
      {id: '03', spaceType: 'land', bonus: [1, 1], x: 4, y: 0},
      {id: '04', spaceType: 'ocean', bonus: [1, 1], x: 5, y: 0},
      {id: '05', spaceType: 'land', bonus: [], x: 6, y: 0},
      {id: '06', spaceType: 'ocean', bonus: [3], x: 7, y: 0},
      {id: '07', spaceType: 'ocean', bonus: [], x: 8, y: 0},
      {id: '08', spaceType: 'land', bonus: [], x: 3, y: 1},
      {id: '09', spaceType: 'land', bonus: [1], x: 4, y: 1},
      {id: '10', spaceType: 'land', bonus: [], x: 5, y: 1},
      {id: '11', spaceType: 'land', bonus: [], x: 6, y: 1},
      {id: '12', spaceType: 'land', bonus: [], x: 7, y: 1},
      {id: '13', spaceType: 'ocean', bonus: [3, 3], x: 8, y: 1},
      {id: '14', spaceType: 'land', bonus: [3], x: 2, y: 2},
      {id: '15', spaceType: 'land', bonus: [], x: 3, y: 2},
      {id: '16', spaceType: 'land', bonus: [], x: 4, y: 2},
      {id: '17', spaceType: 'land', bonus: [], x: 5, y: 2},
      {id: '18', spaceType: 'land', bonus: [], x: 6, y: 2},
      {id: '19', spaceType: 'land', bonus: [], x: 7, y: 2},
      {id: '20', spaceType: 'land', bonus: [1], x: 8, y: 2},
      {id: '21', spaceType: 'land', bonus: [2, 0], x: 1, y: 3},
      {id: '22', spaceType: 'land', bonus: [2], x: 2, y: 3},
      {id: '23', spaceType: 'land', bonus: [2], x: 3, y: 3},
      {id: '24', spaceType: 'land', bonus: [2], x: 4, y: 3},
      {id: '25', spaceType: 'land', bonus: [2, 2], x: 5, y: 3},
      {id: '26', spaceType: 'land', bonus: [2], x: 6, y: 3},
      {id: '27', spaceType: 'land', bonus: [2], x: 7, y: 3},
      {id: '28', spaceType: 'ocean', bonus: [2, 2], x: 8, y: 3},
      {id: '29', spaceType: 'land', bonus: [2, 2], x: 0, y: 4},
      {id: '30', spaceType: 'land', bonus: [2, 2], x: 1, y: 4},
      {id: '31', spaceType: 'land', bonus: [2, 2], x: 2, y: 4},
      {id: '32', spaceType: 'ocean', bonus: [2, 2], x: 3, y: 4},
      {id: '33', spaceType: 'ocean', bonus: [2, 2], x: 4, y: 4},
      {id: '34', spaceType: 'ocean', bonus: [2, 2], x: 5, y: 4},
      {id: '35', spaceType: 'land', bonus: [2, 2], x: 6, y: 4},
      {id: '36', spaceType: 'land', bonus: [2, 2], x: 7, y: 4},
      {id: '37', spaceType: 'land', bonus: [2, 2], x: 8, y: 4},
      {id: '38', spaceType: 'land', bonus: [2], x: 1, y: 5},
      {id: '39', spaceType: 'land', bonus: [2, 2], x: 2, y: 5},
      {id: '40', spaceType: 'land', bonus: [2], x: 3, y: 5},
      {id: '41', spaceType: 'land', bonus: [2], x: 4, y: 5},
      {id: '42', spaceType: 'land', bonus: [2], x: 5, y: 5},
      {id: '43', spaceType: 'ocean', bonus: [2], x: 6, y: 5},
      {id: '44', spaceType: 'ocean', bonus: [2], x: 7, y: 5},
      {id: '45', spaceType: 'ocean', bonus: [2], x: 8, y: 5},
      {id: '46', spaceType: 'land', bonus: [], x: 2, y: 6},
      {id: '47', spaceType: 'land', bonus: [], x: 3, y: 6},
      {id: '48', spaceType: 'land', bonus: [], x: 4, y: 6},
      {id: '49', spaceType: 'land', bonus: [], x: 5, y: 6},
      {id: '50', spaceType: 'land', bonus: [], x: 6, y: 6},
      {id: '51', spaceType: 'land', bonus: [2], x: 7, y: 6},
      {id: '52', spaceType: 'land', bonus: [], x: 8, y: 6},
      {id: '53', spaceType: 'land', bonus: [1, 1], x: 3, y: 7},
      {id: '54', spaceType: 'land', bonus: [], x: 4, y: 7},
      {id: '55', spaceType: 'land', bonus: [3], x: 5, y: 7},
      {id: '56', spaceType: 'land', bonus: [3], x: 6, y: 7},
      {id: '57', spaceType: 'land', bonus: [], x: 7, y: 7},
      {id: '58', spaceType: 'land', bonus: [0], x: 8, y: 7},
      {id: '59', spaceType: 'land', bonus: [1], x: 4, y: 8},
      {id: '60', spaceType: 'land', bonus: [1, 1], x: 5, y: 8},
      {id: '61', spaceType: 'land', bonus: [], x: 6, y: 8},
      {id: '62', spaceType: 'land', bonus: [], x: 7, y: 8},
      {id: '63', spaceType: 'ocean', bonus: [0, 0], x: 8, y: 8},
      {id: '69', spaceType: 'colony', bonus: [], x: -1, y: -1},
    ]);
  });
});
