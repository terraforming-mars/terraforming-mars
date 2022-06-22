import {DEFAULT_GAME_OPTIONS} from '../../src/Game';
import {expect} from 'chai';
import {OriginalBoard} from '../../src/boards/OriginalBoard';
import {Random} from '../../src/Random';
import {SpaceType} from '../../src/common/boards/SpaceType';

describe('OriginalBoard', function() {
  it('has error with input while calling getAdjacentSpaces', function() {
    const board = OriginalBoard.newInstance(DEFAULT_GAME_OPTIONS, new Random(0));
    expect(function() {
      board.getAdjacentSpaces({
        x: 0,
        y: 0,
        bonus: [],
        id: 'foobar',
        spaceType: SpaceType.LAND,
      });
    }).to.throw('Unexpected space ID foobar');
  });
});
