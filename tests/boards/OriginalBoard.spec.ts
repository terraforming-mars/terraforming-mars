import {expect} from 'chai';
import {OriginalBoard} from '../../src/boards/OriginalBoard';
import {SpaceType} from '../../src/SpaceType';

describe('OriginalBoard', function() {
  it('has error with input while calling getAdjacentSpaces', function() {
    const board = OriginalBoard.newInstance(false, 0, false);
    expect(function() {
      board.getAdjacentSpaces({
        x: -1,
        y: 0,
        bonus: [],
        id: 'foobar',
        spaceType: SpaceType.LAND,
      });
    }).to.throw('Unexpected space x value');
    expect(function() {
      board.getAdjacentSpaces({
        x: 0,
        y: -1,
        bonus: [],
        id: 'foobar',
        spaceType: SpaceType.LAND,
      });
    }).to.throw('Unexpected space y value');
  });
  it('has error while calling getForestSpace', function() {
    const board = OriginalBoard.newInstance(false, 0, false);
    expect(function() {
      board.getForestSpace([]);
    }).to.throw('Did not find space for forest');
  });
});
