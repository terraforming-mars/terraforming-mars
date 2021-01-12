import {expect} from 'chai';
import {SpaceType} from '../../src/SpaceType';
import {MoonBoard} from '../../src/moon/MoonBoard';

describe('MoonBoard', function() {
  let board : MoonBoard;

  beforeEach(function() {
    board = MoonBoard.newInstance();
  });

  it('getSpace', () => {
    expect(() => board.getSpace('01').id).to.throw(Error, /Can't find space with id 01/);
    expect(board.getSpace('m01').spaceType).eq(SpaceType.COLONY);
    expect(board.getSpace('m01').id).eq('m01');
  });


  it('getAdjacentSpaces', () => {
    expect(board.getAdjacentSpaces(board.getSpace('m01'))).is.empty;
    expect(board.getAdjacentSpaces(board.getSpace('m02')).map((s) => s.id)).deep.eq(['m03', 'm05', 'm06']);
  });
});
