import {expect} from 'chai';
import {TharsisBoard} from '../../src/server/boards/TharsisBoard';
import {Player} from '../../src/server/Player';
import {TileType} from '../../src/common/TileType';
import {Space} from '../../src/server/boards/Space';
import {SpaceType} from '../../src/common/boards/SpaceType';
import {TestPlayer} from '../TestPlayer';
import {Board} from '../../src/server/boards/Board';
import {SerializedBoard} from '../../src/server/boards/SerializedBoard';
import {NamedMoonSpaces} from '../../src/common/moon/NamedMoonSpaces';
import {SeededRandom} from '../../src/common/utils/Random';
import {DEFAULT_GAME_OPTIONS, GameOptions} from '../../src/server/game/GameOptions';
import {SpaceId} from '../../src/common/Types';
import {CardName} from '../../src/common/cards/CardName';
import {SpaceName} from '../../src/common/boards/SpaceName';
import {testGame} from '../TestGame';
import {toID} from '../../src/common/utils/utils';

describe('Board', () => {
  let board: Board;
  let player: TestPlayer;
  let player2: TestPlayer;

  beforeEach(() => {
    board = TharsisBoard.newInstance(DEFAULT_GAME_OPTIONS, new SeededRandom(0));
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();

    // Rather than create a whole game around this test, I'm mocking data to make the tests pass.
    const gameOptions: Partial<GameOptions> = {pathfindersExpansion: false};
    (player as any).game = {gameOptions};
    (player2 as any).game = {gameOptions};
  });

  it('getSpace', () => {
    expect(board.getSpaceOrThrow('01').spaceType).eq(SpaceType.COLONY);
    expect(board.getSpaceOrThrow('01').id).eq('01');
    expect(() => board.getSpaceOrThrow(NamedMoonSpaces.LUNA_TRADE_STATION).id).to.throw(Error, /Can't find space with id m01/);
  });

  it('getAdjacentSpaces', () => {
    const expectedAdjacentSpaces: Map<string, Array<string>> = new Map([
      ['01', []],
      ['02', []],
      ['03', ['04', '09', '08']],
      ['04', ['05', '10', '09', '03']],
      ['05', ['06', '11', '10', '04']],
      ['06', ['07', '12', '11', '05']],
      ['07', ['13', '12', '06']],
      ['08', ['03', '09', '15', '14']],
      ['09', ['03', '04', '10', '16', '15', '08']],
      ['10', ['04', '05', '11', '17', '16', '09']],
      ['11', ['05', '06', '12', '18', '17', '10']],
      ['12', ['06', '07', '13', '19', '18', '11']],
      ['13', ['07', '20', '19', '12']],
      ['14', ['08', '15', '22', '21']],
      ['15', ['08', '09', '16', '23', '22', '14']],
      ['16', ['09', '10', '17', '24', '23', '15']],
      ['17', ['10', '11', '18', '25', '24', '16']],
      ['18', ['11', '12', '19', '26', '25', '17']],
      ['19', ['12', '13', '20', '27', '26', '18']],
      ['20', ['13', '28', '27', '19']],
      ['21', ['14', '22', '30', '29']],
      ['22', ['14', '15', '23', '31', '30', '21']],
      ['23', ['15', '16', '24', '32', '31', '22']],
      ['24', ['16', '17', '25', '33', '32', '23']],
      ['25', ['17', '18', '26', '34', '33', '24']],
      ['26', ['18', '19', '27', '35', '34', '25']],
      ['27', ['19', '20', '28', '36', '35', '26']],
      ['28', ['20', '37', '36', '27']],
      ['29', ['21', '30', '38']],
      ['30', ['21', '22', '31', '39', '38', '29']],
      ['31', ['22', '23', '32', '40', '39', '30']],
      ['32', ['23', '24', '33', '41', '40', '31']],
      ['33', ['24', '25', '34', '42', '41', '32']],
      ['34', ['25', '26', '35', '43', '42', '33']],
      ['35', ['26', '27', '36', '44', '43', '34']],
      ['36', ['27', '28', '37', '45', '44', '35']],
      ['37', ['28', '45', '36']],
      ['38', ['29', '30', '39', '46']],
      ['39', ['30', '31', '40', '47', '46', '38']],
      ['40', ['31', '32', '41', '48', '47', '39']],
      ['41', ['32', '33', '42', '49', '48', '40']],
      ['42', ['33', '34', '43', '50', '49', '41']],
      ['43', ['34', '35', '44', '51', '50', '42']],
      ['44', ['35', '36', '45', '52', '51', '43']],
      ['45', ['36', '37', '52', '44']],
      ['46', ['38', '39', '47', '53']],
      ['47', ['39', '40', '48', '54', '53', '46']],
      ['48', ['40', '41', '49', '55', '54', '47']],
      ['49', ['41', '42', '50', '56', '55', '48']],
      ['50', ['42', '43', '51', '57', '56', '49']],
      ['51', ['43', '44', '52', '58', '57', '50']],
      ['52', ['44', '45', '58', '51']],
      ['53', ['46', '47', '54', '59']],
      ['54', ['47', '48', '55', '60', '59', '53']],
      ['55', ['48', '49', '56', '61', '60', '54']],
      ['56', ['49', '50', '57', '62', '61', '55']],
      ['57', ['50', '51', '58', '63', '62', '56']],
      ['58', ['51', '52', '63', '57']],
      ['59', ['53', '54', '60']],
      ['60', ['54', '55', '61', '59']],
      ['61', ['55', '56', '62', '60']],
      ['62', ['56', '57', '63', '61']],
      ['63', ['57', '58', '62']],
      ['69', []],
    ]);
    board.spaces.forEach((space) => {
      const expected = expectedAdjacentSpaces.get(space.id);
      const actual = board.getAdjacentSpaces(space).map(toID);
      expect(expected).to.eql(actual);
    });
  });

  it('has error with input while calling getAdjacentSpaces', () => {
    expect(() => {
      board.getAdjacentSpaces({
        x: 0,
        y: 0,
        bonus: [],
        id: 'foobar' as SpaceId,
        spaceType: SpaceType.LAND,
      });
    }).to.throw('Unexpected space ID foobar');
  });

  it('getAdjacentSpacesClockwise', () => {
    expect(
      board.getAdjacentSpacesClockwise(
        board.getSpaceOrThrow('51'))
        .map((space) => space?.id))
      .deep.eq(['43', '44', '52', '58', '57', '50']);

    expect(
      board.getAdjacentSpacesClockwise(
        board.getSpaceOrThrow('20'))
        .map((space) => space?.id))
      .deep.eq(['13', undefined, undefined, '28', '27', '19']);

    expect(
      board.getAdjacentSpacesClockwise(
        board.getSpaceOrThrow('03'))
        .map((space) => space?.id))
      .deep.eq([undefined, undefined, '04', '09', '08', undefined]);
  });

  it('getNthAvailableLandSpace', () => {
    // board spaces start at 03, and the top of the map looks like this
    //
    //    l o l o o
    //   l l l l l o
    expect(board.getNthAvailableLandSpace(0, 'top').id).eq('03');
    expect(board.getNthAvailableLandSpace(1, 'top').id).eq('05');
    expect(board.getNthAvailableLandSpace(2, 'top').id).eq('08');
    expect(board.getNthAvailableLandSpace(3, 'top').id).eq('09');
    // Filter changes available spaces.
    expect(board.getNthAvailableLandSpace(3, 'top', (s) => s.id !== '09').id).eq('10');

    // bottom ends at 63 and looks like this
    //
    //  l l l l l l
    //   l l l l o
    expect(board.getNthAvailableLandSpace(0, 'bottom').id).eq('62');
    expect(board.getNthAvailableLandSpace(1, 'bottom').id).eq('61');
    expect(board.getNthAvailableLandSpace(2, 'bottom').id).eq('60');
    expect(board.getNthAvailableLandSpace(3, 'bottom').id).eq('59');
  });

  it('getNthAvailableLandSpace throws if no spaces available', () => {
    expect(() => {
      board.getNthAvailableLandSpace(0, 'top', () => false);
    }).to.throw('no spaces available');
  });

  function expectSpace(space: Space, id: string, x: number, y: number) {
    if (id !== space.id || x !== space.x || y !== space.y) {
      expect.fail(`space ${space.id} at (${space.x}, ${space.y}) does not match [${id}, ${x}, ${y}]`);
    }
  }

  it('getNthAvailableLandSpace positive', () => {
    // First two rows look like this:
    //  - o - o o      - means land
    // - - - - - o     o means ocean
    // This will skip ocean spaces.

    expectSpace(board.getNthAvailableLandSpace(0, 'top'), '03', 4, 0);
    expectSpace(board.getNthAvailableLandSpace(1, 'top'), '05', 6, 0);
    expectSpace(board.getNthAvailableLandSpace(2, 'top'), '08', 3, 1);
    expectSpace(board.getNthAvailableLandSpace(3, 'top'), '09', 4, 1);
  });

  it('getNthAvailableLandSpace negative', () => {
    // Last two rows look like this:
    // - - - - - -    - means land
    //  - - - - o     o means ocean

    expectSpace(board.getNthAvailableLandSpace(0, 'bottom'), '62', 7, 8);
    expectSpace(board.getNthAvailableLandSpace(1, 'bottom'), '61', 6, 8);
    expectSpace(board.getNthAvailableLandSpace(2, 'bottom'), '60', 5, 8);
    expectSpace(board.getNthAvailableLandSpace(3, 'bottom'), '59', 4, 8);
  });

  it('getNthAvailableLandSpace skips tiles', () => {
    const space = board.getNthAvailableLandSpace(2, 'top');
    expectSpace(board.getNthAvailableLandSpace(2, 'top'), '08', 3, 1);
    space.tile = {tileType: TileType.GREENERY};
    expectSpace(board.getNthAvailableLandSpace(2, 'top'), '09', 4, 1);
  });

  it('getNthAvailableLandSpace skips hazard tiles', () => {
    const space = board.getNthAvailableLandSpace(2, 'top');
    expectSpace(board.getNthAvailableLandSpace(2, 'top'), '08', 3, 1);
    space.tile = {tileType: TileType.DUST_STORM_MILD};
    expectSpace(board.getNthAvailableLandSpace(2, 'top'), '09', 4, 1);
  });

  // This happens with the Ares expansion and cards come out mid-game
  // after the board is already populated. Though, here, the high
  // card costs substitite for a heavily-populated board.
  it('getNthAvailableLandSpace with a large card', () => {
    expect(board.getNthAvailableLandSpace(46, 'top').id).eq('61');
    expect(board.getNthAvailableLandSpace(47, 'top').id).eq('62');
    expect(board.getNthAvailableLandSpace(48, 'top').id).eq('03');
    expect(board.getNthAvailableLandSpace(49, 'top').id).eq('05');
    expect(board.getNthAvailableLandSpace(50, 'top').id).eq('08');

    expect(board.getNthAvailableLandSpace(46, 'bottom').id).eq('05');
    expect(board.getNthAvailableLandSpace(47, 'bottom').id).eq('03');
    expect(board.getNthAvailableLandSpace(48, 'bottom').id).eq('62');
    expect(board.getNthAvailableLandSpace(49, 'bottom').id).eq('61');
    expect(board.getNthAvailableLandSpace(50, 'bottom').id).eq('60');
  });

  class TestBoard extends Board {
    public constructor(spaces: Array<Space>) {
      super(spaces, undefined, []);
    }
  }

  it('deserialize', () => {
    const boardJson: SerializedBoard = {
      'spaces': [
        {
          'id': '01',
          'spaceType': SpaceType.COLONY, 'bonus': [],
          'x': -1, 'y': -1, 'player': 'p-name-1-id',
          'tile': {'tileType': 2},
        },
        {
          'id': '03',
          'spaceType': SpaceType.LAND, 'bonus': [1, 1],
          'x': 4, 'y': 0, 'player': 'p-name-2-id',
          'tile': {'tileType': 0},
        },
        {
          'id': '04',
          'spaceType': SpaceType.OCEAN, 'bonus': [1, 1],
          'x': 5, 'y': 0,
          'tile': {'tileType': 1},
        },
        {
          'id': '05',
          'spaceType': SpaceType.LAND, 'bonus': [],
          'x': 6, 'y': 0,
        },
      ],
    };
    const player1 = new Player('name-1', 'red', false, 0, 'p-name-1-id');
    const player2 = new Player('name-2', 'yellow', false, 0, 'p-name-2-id');

    const board = new TestBoard(Board.deserialize(boardJson, [player1, player2]).spaces);
    expect(board.getSpaceOrThrow('01').player).eq(player1);
    expect(board.getSpaceOrThrow('03').player).eq(player2);
  });

  const runs = [
    {cards: [], spaces: [SpaceName.GANYMEDE_COLONY, SpaceName.PHOBOS_SPACE_HAVEN]},
    {cards: [CardName.STANFORD_TORUS], spaces: [SpaceName.GANYMEDE_COLONY, SpaceName.PHOBOS_SPACE_HAVEN, SpaceName.STANFORD_TORUS]},
    {cards: [CardName.VENERA_BASE], spaces: [SpaceName.GANYMEDE_COLONY, SpaceName.PHOBOS_SPACE_HAVEN, SpaceName.VENERA_BASE]},
    {cards: [CardName.STANFORD_TORUS, CardName.VENERA_BASE], spaces: [SpaceName.GANYMEDE_COLONY, SpaceName.PHOBOS_SPACE_HAVEN, SpaceName.STANFORD_TORUS, SpaceName.VENERA_BASE]},
  ] as const;
  for (const run of runs) {
    it('including cards adds their spaces ' + JSON.stringify(run.cards), () => {
      const [game] = testGame(1, {includedCards: run.cards});
      const spaceIds = game.board.spaces.filter((space) => space.spaceType === SpaceType.COLONY).map(toID);
      expect(spaceIds).to.have.members(run.spaces);
    });
  }
});
