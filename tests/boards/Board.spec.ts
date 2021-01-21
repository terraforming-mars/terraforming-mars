import {expect} from 'chai';
import {OriginalBoard} from '../../src/boards/OriginalBoard';
import {Player} from '../../src/Player';
import {TileType} from '../../src/TileType';
import {ISpace} from '../../src/boards/ISpace';
import {SpaceType} from '../../src/SpaceType';
import {TestPlayers} from '../TestingUtils';
import {Board} from '../../src/boards/Board';
import {Color} from '../../src/Color';
import {SerializedBoard} from '../../src/boards/SerializedBoard';
import {MoonSpaces} from '../../src/moon/MoonSpaces';
import {Random} from '../../src/Random';

describe('Board', function() {
  let board : OriginalBoard; let player : Player; let player2 : Player;

  beforeEach(function() {
    board = OriginalBoard.newInstance(false, new Random(0), false);
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
  });

  it('getSpace', () => {
    expect(board.getSpace('01').spaceType).eq(SpaceType.COLONY);
    expect(board.getSpace('01').id).eq('01');
    expect(() => board.getSpace(MoonSpaces.LUNA_TRADE_STATION).id).to.throw(Error, /Can't find space with id m01/);
  });

  it('Can have greenery placed on any available land when player has no tile placed', function() {
    const availableSpaces = board.getAvailableSpacesForGreenery(player);
    expect(availableSpaces).has.lengthOf(board.getAvailableSpacesOnLand(player).length);
  });

  it('Can have greenery placed on any available land when player has a tile placed that is land locked', function() {
    board.spaces[2].player = player;
    board.spaces[2].tile = {tileType: TileType.GREENERY};
    board.spaces[7].player = player2;
    board.spaces[7].tile = {tileType: TileType.GREENERY};
    board.spaces[8].player = player2;
    board.spaces[8].tile = {tileType: TileType.GREENERY};
    const availableSpaces = board.getAvailableSpacesForGreenery(player);
    expect(availableSpaces).has.lengthOf(board.getAvailableSpacesOnLand(player).length);
  });

  it('Can only place greenery adjacent to a tile a player owns', function() {
    board.spaces[2].player = player;
    board.spaces[2].tile = {tileType: TileType.GREENERY};
    board.spaces[7].player = player2;
    board.spaces[7].tile = {tileType: TileType.GREENERY};
    const availableSpaces = board.getAvailableSpacesForGreenery(player);
    expect(availableSpaces).has.lengthOf(1);
  });

  it('getAdjacentSpaces', () => {
    const expectedAdjacentSpaces: Map<string, Array<string>> = new Map([
      ['01', []],
      ['02', []],
      ['03', ['04', '08', '09']],
      ['04', ['03', '05', '09', '10']],
      ['05', ['04', '06', '10', '11']],
      ['06', ['05', '07', '11', '12']],
      ['07', ['06', '12', '13']],
      ['08', ['03', '09', '14', '15']],
      ['09', ['03', '04', '08', '10', '15', '16']],
      ['10', ['04', '05', '09', '11', '16', '17']],
      ['11', ['05', '06', '10', '12', '17', '18']],
      ['12', ['06', '07', '11', '13', '18', '19']],
      ['13', ['07', '12', '19', '20']],
      ['14', ['08', '15', '21', '22']],
      ['15', ['08', '09', '14', '16', '22', '23']],
      ['16', ['09', '10', '15', '17', '23', '24']],
      ['17', ['10', '11', '16', '18', '24', '25']],
      ['18', ['11', '12', '17', '19', '25', '26']],
      ['19', ['12', '13', '18', '20', '26', '27']],
      ['20', ['13', '19', '27', '28']],
      ['21', ['14', '22', '29', '30']],
      ['22', ['14', '15', '21', '23', '30', '31']],
      ['23', ['15', '16', '22', '24', '31', '32']],
      ['24', ['16', '17', '23', '25', '32', '33']],
      ['25', ['17', '18', '24', '26', '33', '34']],
      ['26', ['18', '19', '25', '27', '34', '35']],
      ['27', ['19', '20', '26', '28', '35', '36']],
      ['28', ['20', '27', '36', '37']],
      ['29', ['21', '30', '38']],
      ['30', ['21', '22', '29', '31', '38', '39']],
      ['31', ['22', '23', '30', '32', '39', '40']],
      ['32', ['23', '24', '31', '33', '40', '41']],
      ['33', ['24', '25', '32', '34', '41', '42']],
      ['34', ['25', '26', '33', '35', '42', '43']],
      ['35', ['26', '27', '34', '36', '43', '44']],
      ['36', ['27', '28', '35', '37', '44', '45']],
      ['37', ['28', '36', '45']],
      ['38', ['29', '30', '39', '46']],
      ['39', ['30', '31', '38', '40', '46', '47']],
      ['40', ['31', '32', '39', '41', '47', '48']],
      ['41', ['32', '33', '40', '42', '48', '49']],
      ['42', ['33', '34', '41', '43', '49', '50']],
      ['43', ['34', '35', '42', '44', '50', '51']],
      ['44', ['35', '36', '43', '45', '51', '52']],
      ['45', ['36', '37', '44', '52']],
      ['46', ['38', '39', '47', '53']],
      ['47', ['39', '40', '46', '48', '53', '54']],
      ['48', ['40', '41', '47', '49', '54', '55']],
      ['49', ['41', '42', '48', '50', '55', '56']],
      ['50', ['42', '43', '49', '51', '56', '57']],
      ['51', ['43', '44', '50', '52', '57', '58']],
      ['52', ['44', '45', '51', '58']],
      ['53', ['46', '47', '54', '59']],
      ['54', ['47', '48', '53', '55', '59', '60']],
      ['55', ['48', '49', '54', '56', '60', '61']],
      ['56', ['49', '50', '55', '57', '61', '62']],
      ['57', ['50', '51', '56', '58', '62', '63']],
      ['58', ['51', '52', '57', '63']],
      ['59', ['53', '54', '60']],
      ['60', ['54', '55', '59', '61']],
      ['61', ['55', '56', '60', '62']],
      ['62', ['56', '57', '61', '63']],
      ['63', ['57', '58', '62']],
      ['69', []],
    ]);
    board.spaces.forEach((space) => {
      const expected = expectedAdjacentSpaces.get(space.id)!;
      const actual = board.getAdjacentSpaces(space).map((s) => s.id);
      expect(expected).to.have.members(actual);
    });
  });

  it('getNthAvailableLandSpace', function() {
    // board spaces start at 03, and the top of the map looks like this
    //
    //    l o l o o
    //   l l l l l o
    expect(board.getNthAvailableLandSpace(0, 1).id).eq('03');
    expect(board.getNthAvailableLandSpace(1, 1).id).eq('05');
    expect(board.getNthAvailableLandSpace(2, 1).id).eq('08');
    expect(board.getNthAvailableLandSpace(3, 1).id).eq('09');
    // Filter changes available spaces.
    expect(board.getNthAvailableLandSpace(3, 1, undefined /* player */, (s) => s.id !== '09').id).eq('10');

        // Filter player tokens (I'm looking at you, Land Claim)
        board.spaces.find((s) => s.id === '05')!.player = player;
        expect(board.getNthAvailableLandSpace(3, 1, player2).id).eq('10');
        expect(board.getNthAvailableLandSpace(3, 1, player).id).eq('09');

        // bottom ends at 63 and looks like this
        //
        //  l l l l l l
        //   l l l l o
        expect(board.getNthAvailableLandSpace(0, -1).id).eq('62');
        expect(board.getNthAvailableLandSpace(1, -1).id).eq('61');
        expect(board.getNthAvailableLandSpace(2, -1).id).eq('60');
        expect(board.getNthAvailableLandSpace(3, -1).id).eq('59');
  });

  it('getNthAvailableLandSpace throws if no spaces available', function() {
    expect(function() {
      board.getNthAvailableLandSpace(0, 1, undefined, () => false);
    }).to.throw('no spaces available');
  });

  function expectSpace(space: ISpace, id: string, x: number, y: number) {
    if (id !== space.id || x !== space.x || y !== space.y) {
      expect.fail(`space ${space.id} at (${space.x}, ${space.y}) does not match [${id}, ${x}, ${y}]`);
    }
  }

  it('getNthAvailableLandSpace positive', function() {
    // First two rows look like this:
    //  - o - o o      - means land
    // - - - - - o     o means ocean
    // This will skip ocean spaces.

    expectSpace(board.getNthAvailableLandSpace(0, 1), '03', 4, 0);
    expectSpace(board.getNthAvailableLandSpace(1, 1), '05', 6, 0);
    expectSpace(board.getNthAvailableLandSpace(2, 1), '08', 3, 1);
    expectSpace(board.getNthAvailableLandSpace(3, 1), '09', 4, 1);
  });

  it('getNthAvailableLandSpace negative', function() {
    // Last two rows look like this:
    // - - - - - -    - means land
    //  - - - - o     o means ocean

    expectSpace(board.getNthAvailableLandSpace(0, -1), '62', 7, 8);
    expectSpace(board.getNthAvailableLandSpace(1, -1), '61', 6, 8);
    expectSpace(board.getNthAvailableLandSpace(2, -1), '60', 5, 8);
    expectSpace(board.getNthAvailableLandSpace(3, -1), '59', 4, 8);
  });

  it('getNthAvailableLandSpace skips tiles', function() {
    const space = board.getNthAvailableLandSpace(2, 1);
    expectSpace(board.getNthAvailableLandSpace(2, 1), '08', 3, 1);
    space.tile = {tileType: TileType.GREENERY};
    expectSpace(board.getNthAvailableLandSpace(2, 1), '09', 4, 1);
  });

  it('getNthAvailableLandSpace skips hazard tiles', function() {
    const space = board.getNthAvailableLandSpace(2, 1);
    expectSpace(board.getNthAvailableLandSpace(2, 1), '08', 3, 1);
    space.tile = {tileType: TileType.DUST_STORM_MILD};
    expectSpace(board.getNthAvailableLandSpace(2, 1), '09', 4, 1);
  });

  // This happens with the Ares expansion and cards come out mid-game
  // after the board is already populated. Though, here, the high
  // card costs substitite for a heavily-populated board.
  it('getNthAvailableLandSpace with a large card', function() {
    expect(board.getNthAvailableLandSpace(46, 1).id).eq('61');
    expect(board.getNthAvailableLandSpace(47, 1).id).eq('62');
    expect(board.getNthAvailableLandSpace(48, 1).id).eq('03');
    expect(board.getNthAvailableLandSpace(49, 1).id).eq('05');
    expect(board.getNthAvailableLandSpace(50, 1).id).eq('08');

    expect(board.getNthAvailableLandSpace(46, -1).id).eq('05');
    expect(board.getNthAvailableLandSpace(47, -1).id).eq('03');
    expect(board.getNthAvailableLandSpace(48, -1).id).eq('62');
    expect(board.getNthAvailableLandSpace(49, -1).id).eq('61');
    expect(board.getNthAvailableLandSpace(50, -1).id).eq('60');
  });

  it('getOceansOnBoard', function() {
    expect(board.getOceansOnBoard()).eq(0);

    const space1 = board.spaces[1];
    space1.spaceType = SpaceType.OCEAN;
    space1.tile = {tileType: TileType.OCEAN};

    expect(board.getOceansOnBoard(true)).eq(1);
    expect(board.getOceansOnBoard(false)).eq(1);

    const space2 = board.spaces[2];
    space2.spaceType = SpaceType.OCEAN;
    space2.tile = {tileType: TileType.OCEAN_SANCTUARY};

    expect(board.getOceansOnBoard(true)).eq(2);
    expect(board.getOceansOnBoard(false)).eq(1);
  });

  class TestBoard extends Board {
    public constructor(spaces: Array<ISpace>) {
      super(spaces);
    };

    public getSpaceById(id: string): ISpace | undefined {
      return this.spaces.find((space) => space.id === id);
    }

    public getVolcanicSpaceIds(): Array<string> {
      return [];
    }

    public getNoctisCitySpaceIds(): Array<string> {
      return [];
    }
  };

  it('deserialize', () => {
    const boardJson = {
      'spaces': [
        {
          'id': '01',
          'spaceType': 'colony', 'bonus': [],
          'x': -1, 'y': -1, 'player': 'name-1-id',
          'tile': {'tileType': 2},
        },
        {
          'id': '03',
          'spaceType': 'land', 'bonus': [1, 1],
          'x': 4, 'y': 0, 'player': 'name-2-id',
          'tile': {'tileType': 0},
        },
        {
          'id': '04',
          'spaceType': 'ocean', 'bonus': [1, 1],
          'x': 5, 'y': 0,
          'tile': {'tileType': 1},
        },
        {
          'id': '05',
          'spaceType': 'land', 'bonus': [],
          'x': 6, 'y': 0,
        },
      ],
    };
    const player1 = new Player('name-1', Color.RED, false, 0, 'name-1-id');
    const player2 = new Player('name-2', Color.YELLOW, false, 0, 'name-2-id');

    const board = new TestBoard(Board.deserializeSpaces((boardJson as SerializedBoard).spaces, [player1, player2]));
    expect(board.getSpaceById('01')!.player).eq(player1);
    expect(board.getSpaceById('03')!.player).eq(player2);
  });
});
