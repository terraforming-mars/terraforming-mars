import {expect} from 'chai';
import {SpaceType} from '../../src/common/boards/SpaceType';
import {MoonBoard} from '../../src/server/moon/MoonBoard';
import {MoonSpaces} from '../../src/common/moon/MoonSpaces';
import {SpaceId} from '../../src/common/Types';
import {SeededRandom} from '../../src/common/utils/Random';
import {DEFAULT_GAME_OPTIONS} from '../../src/server/game/GameOptions';

describe('MoonBoard', function() {
  let board: MoonBoard;

  beforeEach(function() {
    board = MoonBoard.newInstance(DEFAULT_GAME_OPTIONS, new SeededRandom(0));
  });

  it('sanity', () => {
    expect(board.spaces).to.deep.eq([
      {id: 'm01', spaceType: 'colony', x: -1, y: -1, bonus: []},
      {id: 'm02', spaceType: 'land', x: 2, y: 0, bonus: []},
      {id: 'm03', spaceType: 'land', x: 3, y: 0, bonus: [1, 3]},
      {id: 'm04', spaceType: 'land', x: 4, y: 0, bonus: []},
      {id: 'm05', spaceType: 'lunar_mine', x: 5, y: 0, bonus: [0]},
      {id: 'm06', spaceType: 'lunar_mine', x: 1, y: 1, bonus: [0, 0]},
      {id: 'm07', spaceType: 'lunar_mine', x: 2, y: 1, bonus: []},
      {id: 'm08', spaceType: 'land', x: 3, y: 1, bonus: [1]},
      {id: 'm09', spaceType: 'land', x: 4, y: 1, bonus: []},
      {id: 'm10', spaceType: 'land', x: 5, y: 1, bonus: []},
      {id: 'm11', spaceType: 'lunar_mine', x: 0, y: 2, bonus: []},
      {id: 'm12', spaceType: 'land', x: 1, y: 2, bonus: [1]},
      {id: 'm13', spaceType: 'land', x: 2, y: 2, bonus: [1, 0]},
      {id: 'm14', spaceType: 'lunar_mine', x: 3, y: 2, bonus: []},
      {id: 'm15', spaceType: 'lunar_mine', x: 4, y: 2, bonus: [0]},
      {id: 'm16', spaceType: 'land', x: 5, y: 2, bonus: [1, 1]},
      {id: 'm17', spaceType: 'land', x: 0, y: 3, bonus: [1]},
      {id: 'm18', spaceType: 'land', x: 1, y: 3, bonus: []},
      {id: 'm19', spaceType: 'land', x: 2, y: 3, bonus: []},
      {id: 'm20', spaceType: 'lunar_mine', x: 3, y: 3, bonus: [0]},
      {id: 'm21', spaceType: 'lunar_mine', x: 4, y: 3, bonus: [0]},
      {id: 'm22', spaceType: 'land', x: 0, y: 4, bonus: []},
      {id: 'm23', spaceType: 'lunar_mine', x: 1, y: 4, bonus: [0]},
      {id: 'm24', spaceType: 'lunar_mine', x: 2, y: 4, bonus: []},
      {id: 'm25', spaceType: 'land', x: 3, y: 4, bonus: []},
      {id: 'm26', spaceType: 'lunar_mine', x: 4, y: 4, bonus: []},
      {id: 'm27', spaceType: 'land', x: 5, y: 4, bonus: [1]},
      {id: 'm28', spaceType: 'land', x: 1, y: 5, bonus: []},
      {id: 'm29', spaceType: 'land', x: 2, y: 5, bonus: [1]},
      {id: 'm30', spaceType: 'land', x: 3, y: 5, bonus: [1]},
      {id: 'm31', spaceType: 'land', x: 4, y: 5, bonus: [3, 3]},
      {id: 'm32', spaceType: 'land', x: 5, y: 5, bonus: [1]},
      {id: 'm33', spaceType: 'land', x: 2, y: 6, bonus: [3, 3]},
      {id: 'm34', spaceType: 'lunar_mine', x: 3, y: 6, bonus: [0]},
      {id: 'm35', spaceType: 'lunar_mine', x: 4, y: 6, bonus: [0, 0]},
      {id: 'm36', spaceType: 'land', x: 5, y: 6, bonus: []},
      {id: 'm37', spaceType: 'colony', x: -1, y: -1, bonus: []},
    ]);
  });

  it('getSpace', () => {
    expect(() => board.getSpaceOrThrow('01').id).to.throw(Error, /Can't find space with id 01/);
    expect(board.getSpaceOrThrow('m01').spaceType).eq(SpaceType.COLONY);
    expect(board.getSpaceOrThrow(MoonSpaces.LUNA_TRADE_STATION).id).eq('m01');
  });

  const testCases: Array<[SpaceId, Array<SpaceId>]> = [
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
      const space = board.getSpaceOrThrow(spaceId);
      const actual = board.getAdjacentSpaces(space).map((s) => s.id);
      expect(expected).to.eql(actual);
    });
  });

  it('Randomizes map for Moon', () => {
    for (let idx = 0; idx < 4_000; idx++) {
      const seed = Math.random();
      const board = MoonBoard.newInstance({
        ...DEFAULT_GAME_OPTIONS,
        shuffleMapOption: true,
      },
      new SeededRandom(seed));
      const reservedSpaces = [MoonSpaces.LUNA_TRADE_STATION,
        MoonSpaces.MARE_IMBRIUM,
        MoonSpaces.MARE_NECTARIS,
        MoonSpaces.MARE_NUBIUM,
        MoonSpaces.MARE_SERENITATIS,
        MoonSpaces.MOMENTUM_VIRIUM,
      ].map((id) => board.getSpaceOrThrow(id).spaceType);
      expect(reservedSpaces, `for seed ${seed}`).deep.eq([SpaceType.COLONY, SpaceType.LUNAR_MINE, SpaceType.LUNAR_MINE, SpaceType.LUNAR_MINE, SpaceType.LUNAR_MINE, SpaceType.COLONY]);
    }
  });
});
