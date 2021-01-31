import {expect} from 'chai';
import {SpaceType} from '../../src/SpaceType';
import {MoonBoard} from '../../src/moon/MoonBoard';
import {MoonSpaces} from '../../src/moon/MoonSpaces';

describe('MoonBoard', function() {
  let board : MoonBoard;

  beforeEach(function() {
    board = MoonBoard.newInstance();
  });

  it('getSpace', () => {
    expect(() => board.getSpace('01').id).to.throw(Error, /Can't find space with id 01/);
    expect(board.getSpace('m01').spaceType).eq(SpaceType.COLONY);
    expect(board.getSpace(MoonSpaces.LUNA_TRADE_STATION).id).eq('m01');
  });


  it('getAdjacentSpaces', () => {
    expect(board.getAdjacentSpaces(board.getSpace('m01'))).is.empty;
    expect(board.getAdjacentSpaces(board.getSpace('m02')).map((s) => s.id)).deep.eq(['m03', 'm06', 'm05']);
  });

  it('getAdjacentSpaces', () => {
    const expectedAdjacentSpaces: Map<string, Array<string>> = new Map([
      ['m01', []],
      ['m02', ['m03', 'm06', 'm05']],
      ['m03', ['m04', 'm07', 'm06', 'm02']],
      ['m04', ['m08', 'm07', 'm03']],
      ['m05', ['m02', 'm06', 'm10', 'm09']],
      ['m06', ['m02', 'm03', 'm07', 'm11', 'm10', 'm05']],
      ['m07', ['m03', 'm04', 'm08', 'm12', 'm11', 'm06']],
      ['m08', ['m04', 'm13', 'm12', 'm07']],
      ['m09', ['m05', 'm10', 'm14']],
      ['m10', ['m05', 'm06', 'm11', 'm15', 'm14', 'm09']],
      ['m11', ['m06', 'm07', 'm12', 'm16', 'm15', 'm10']],
      ['m12', ['m07', 'm08', 'm13', 'm17', 'm16', 'm11']],
      ['m13', ['m08', 'm17', 'm12']],
      ['m14', ['m09', 'm10', 'm15', 'm18']],
      ['m15', ['m10', 'm11', 'm16', 'm19', 'm18', 'm14']],
      ['m16', ['m11', 'm12', 'm17', 'm20', 'm19', 'm15']],
      ['m17', ['m12', 'm13', 'm20', 'm16']],
      ['m18', ['m14', 'm15', 'm19']],
      ['m19', ['m15', 'm16', 'm20', 'm18']],
      ['m20', ['m16', 'm17', 'm19']],
      ['m21', []],
    ]);

    board.spaces.forEach((space) => {
      const expected = expectedAdjacentSpaces.get(space.id)!;
      const actual = board.getAdjacentSpaces(space).map((s) => s.id);
      expect(expected).to.eql(actual);
    });
  });
});
