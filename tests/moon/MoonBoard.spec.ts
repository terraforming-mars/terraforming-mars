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


  const testCases: Array<[string, Array<string>]> = [
    ['m01', []],
    ['m02', ['m03', 'm07', 'm06']],
    ['m03', ['m04', 'm08', 'm07', 'm02']],
    ['m04', ['m05', 'm09', 'm08', 'm03']],
    ['m05', ['m10', 'm09', 'm04']],
    ['m06', ['m02', 'm07', 'm12', 'm11']],
    ['m07', ['m02', 'm03', 'm08', 'm13', 'm12', 'm06']],
    ['m08', ['m03', 'm04', 'm09', 'm14', 'm13', 'm07']],
    ['m09', ['m04', 'm05', 'm10', 'm15', 'm14', 'm08']],
    ['m10', ['m05', 'm16', 'm15', 'm09']],
    ['m11', ['m06', 'm12', 'm17']],
    ['m12', ['m06', 'm07', 'm13', 'm18', 'm17', 'm11']],
    ['m13', ['m07', 'm08', 'm14', 'm19', 'm18', 'm12']],
    ['m14', ['m08', 'm09', 'm15', 'm20', 'm19', 'm13']],
    ['m15', ['m09', 'm10', 'm16', 'm21', 'm20', 'm14']],
    ['m16', ['m10', 'm21', 'm15']],
    ['m17', ['m11', 'm12', 'm18', 'm23', 'm22']],
    ['m18', ['m12', 'm13', 'm19', 'm24', 'm23', 'm17']],
    ['m19', ['m13', 'm14', 'm20', 'm25', 'm24', 'm18']],
    ['m20', ['m14', 'm15', 'm21', 'm26', 'm25', 'm19']],
    ['m21', ['m15', 'm16', 'm27', 'm26', 'm20']],
    ['m22', ['m17', 'm23', 'm28']],
    ['m23', ['m17', 'm18', 'm24', 'm29', 'm28', 'm22']],
    ['m24', ['m18', 'm19', 'm25', 'm30', 'm29', 'm23']],
    ['m25', ['m19', 'm20', 'm26', 'm31', 'm30', 'm24']],
    ['m26', ['m20', 'm21', 'm27', 'm32', 'm31', 'm25']],
    ['m27', ['m21', 'm32', 'm26']],
    ['m28', ['m22', 'm23', 'm29', 'm33']],
    ['m29', ['m23', 'm24', 'm30', 'm34', 'm33', 'm28']],
    ['m30', ['m24', 'm25', 'm31', 'm35', 'm34', 'm29']],
    ['m31', ['m25', 'm26', 'm32', 'm36', 'm35', 'm30']],
    ['m32', ['m26', 'm27', 'm36', 'm31']],
    ['m33', ['m28', 'm29', 'm34']],
    ['m34', ['m29', 'm30', 'm35', 'm33']],
    ['m35', ['m30', 'm31', 'm36', 'm34']],
    ['m36', ['m31', 'm32', 'm35']],
    ['m37', []],
  ];

  testCases.forEach(([spaceId, expected]) => {
    it('getAdjacentSpaces - ' + spaceId, () => {
      const space = board.getSpace(spaceId);
      const actual = board.getAdjacentSpaces(space).map((s) => s.id);
      expect(expected).to.eql(actual);
    });
  });
});
