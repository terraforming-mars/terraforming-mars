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

describe('Board', function() {
  let board : OriginalBoard; let player : Player; let player2 : Player;

  beforeEach(function() {
    board = OriginalBoard.newInstance(false, 0, false);
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
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
    public constructor(public spaces: Array<ISpace>) {
      super();
    };

    public getSpaceById(id: string): ISpace | undefined {
      return this.spaces.find((space) => space.id === id);
    }
  };

  it('deserialize-backward compatible', () => {
    const player1 = new Player('name-1', Color.RED, false, 0, 'name-1-id');
    const player2 = new Player('name-2', Color.YELLOW, false, 0, 'name-2-id');
    const json = {
      'spaces': [
        {
          'id': '01',
          'spaceType': 'colony',
          'bonus': [],
          'x': -1,
          'y': -1,
          'player': {
            'name': 'name-1',
            'color': 'blue',
            'beginner': false,
            'handicap': 0,
            'usedUndo': false,
            'id': 'name-1-id',
          },
          'tile': {
            'tileType': 2,
          },
        },
        {
          'id': '03',
          'spaceType': 'land',
          'bonus': [
            1,
            1,
          ],
          'x': 4,
          'y': 0,
          'player': {
            'name': 'name-2',
            'color': 'green',
            'beginner': false,
            'handicap': 0,
            'usedUndo': false,
            'id': 'name-2-id',
          },
          'tile': {
            'tileType': 0,
          },
        },
        {
          'id': '04',
          'spaceType': 'ocean',
          'bonus': [
            1,
            1,
          ],
          'x': 5,
          'y': 0,
          'tile': {
            'tileType': 1,
          },
        },
        {
          'id': '05',
          'spaceType': 'land',
          'bonus': [],
          'x': 6,
          'y': 0,
        },
      ],
    } as SerializedBoard;
    const board = new TestBoard(Board.deserializeSpaces(json.spaces, [player1, player2]));
    expect(board.getSpaceById('01')!.player).eq(player1);
    expect(board.getSpaceById('03')!.player).eq(player2);

    const serialized = board.serialize();
    const boardJson = {
      'spaces': [
        {
          'id': '01',
          'spaceType': 'colony', 'adjacency': undefined, 'bonus': [],
          'x': -1, 'y': -1, 'player': 'name-1-id',
          'tile': {'tileType': 2},
        },
        {
          'id': '03',
          'spaceType': 'land', 'adjacency': undefined, 'bonus': [1, 1],
          'x': 4, 'y': 0, 'player': 'name-2-id',
          'tile': {'tileType': 0},
        },
        {
          'id': '04',
          'spaceType': 'ocean', 'adjacency': undefined, 'bonus': [1, 1],
          'x': 5, 'y': 0, 'player': undefined,
          'tile': {'tileType': 1},
        },
        {
          'id': '05',
          'spaceType': 'land', 'adjacency': undefined, 'bonus': [],
          'x': 6, 'y': 0, 'player': undefined,
          'tile': undefined,
        },
      ],
    };
    expect(serialized).deep.eq(boardJson);
  });


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
