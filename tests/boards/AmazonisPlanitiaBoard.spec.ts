import * as constants from '@/common/constants';
import {expect} from 'chai';
import {DEFAULT_GAME_OPTIONS} from '@/server/game/GameOptions';
import {AmazonisPlanitiaBoard} from '@/server/boards/AmazonisPlanitiaBoard';
import {SeededRandom} from '@/common/utils/Random';
import {SpaceType} from '@/common/boards/SpaceType';
import {BoardName} from '@/common/boards/BoardName';
import {TileType} from '@/common/TileType';
import {Board} from '@/server/boards/Board';
import {Game} from '@/server/Game';
import {testGame} from '../TestGame';
import {IGame} from '@/server/IGame';
import {TestPlayer} from '@tests/TestPlayer';
import {cast, toID} from '@/common/utils/utils';
import {setTemperature, setOxygenLevel, maxOutOceans} from '@tests/TestingUtils';

describe('AmazonisPlanitiaBoard', () => {
  it('sanity test', () => {
    const board = AmazonisPlanitiaBoard.newInstance(DEFAULT_GAME_OPTIONS, new SeededRandom(0));
    expect(board.spaces).to.deep.eq([
      {id: 'c01', spaceType: 'colony', bonus: [], edge: false, x: -1, y: -1},
      {id: 'c02', spaceType: 'colony', bonus: [], edge: false, x: -1, y: -1},
      // y=0, x=5..10
      {id: '03', spaceType: 'land', bonus: [1], edge: true, x: 5, y: 0},
      {id: '04', spaceType: 'land', bonus: [1, 1], edge: true, x: 6, y: 0},
      {id: '05', spaceType: 'land', bonus: [1], edge: true, x: 7, y: 0},
      {id: '06', spaceType: 'land', bonus: [3], edge: true, x: 8, y: 0},
      {id: '07', spaceType: 'land', bonus: [0, 0], edge: true, x: 9, y: 0},
      {id: '08', spaceType: 'land', bonus: [], edge: true, x: 10, y: 0},
      // y=1, x=4..10
      {id: '09', spaceType: 'ocean', bonus: [], edge: true, x: 4, y: 1},
      {id: '10', spaceType: 'land', bonus: [16], edge: false, x: 5, y: 1},
      {id: '11', spaceType: 'land', bonus: [1], edge: false, x: 6, y: 1},
      {id: '12', spaceType: 'land', bonus: [], edge: false, x: 7, y: 1},
      {id: '13', spaceType: 'land', bonus: [2], edge: false, x: 8, y: 1},
      {id: '14', spaceType: 'ocean', bonus: [2, 2], edge: false, x: 9, y: 1},
      {id: '15', spaceType: 'ocean', bonus: [0, 0], edge: true, x: 10, y: 1},
      // y=2, x=3..10
      {id: '16', spaceType: 'ocean', bonus: [1, 1], edge: true, x: 3, y: 2},
      {id: '17', spaceType: 'land', bonus: [], edge: false, x: 4, y: 2},
      {id: '18', spaceType: 'land', bonus: [3, 3], edge: false, x: 5, y: 2},
      {id: '19', spaceType: 'land', bonus: [], edge: false, x: 6, y: 2},
      {id: '20', spaceType: 'land', bonus: [2], edge: false, x: 7, y: 2},
      {id: '21', spaceType: 'ocean', bonus: [], edge: false, x: 8, y: 2},
      {id: '22', spaceType: 'land', bonus: [], edge: false, x: 9, y: 2},
      {id: '23', spaceType: 'land', bonus: [], edge: true, x: 10, y: 2},
      // y=3, x=2..10
      {id: '24', spaceType: 'land', bonus: [0], edge: true, x: 2, y: 3},
      {id: '25', spaceType: 'ocean', bonus: [], edge: false, x: 3, y: 3},
      {id: '26', spaceType: 'land', bonus: [], edge: false, x: 4, y: 3},
      {id: '27', spaceType: 'land', bonus: [], edge: false, x: 5, y: 3},
      {id: '28', spaceType: 'land', bonus: [2], edge: false, x: 6, y: 3},
      {id: '29', spaceType: 'land', bonus: [2], edge: false, x: 7, y: 3},
      {id: '30', spaceType: 'land', bonus: [2, 2], edge: false, x: 8, y: 3},
      {id: '31', spaceType: 'land', bonus: [2], edge: false, x: 9, y: 3},
      {id: '32', spaceType: 'land', bonus: [2, 3], edge: true, x: 10, y: 3},
      // y=4, x=1..10
      {id: '33', spaceType: 'land', volcanic: true, bonus: [1, 1], edge: true, x: 1, y: 4},
      {id: '34', spaceType: 'land', bonus: [2], edge: false, x: 2, y: 4},
      {id: '35', spaceType: 'land', bonus: [19], edge: false, x: 3, y: 4},
      {id: '36', spaceType: 'land', bonus: [2], edge: false, x: 4, y: 4},
      {id: '37', spaceType: 'ocean', bonus: [3], edge: false, x: 5, y: 4},
      {id: '38', spaceType: 'land', bonus: [2], edge: false, x: 6, y: 4},
      {id: '39', spaceType: 'land', bonus: [2, 2], edge: false, x: 7, y: 4},
      {id: '40', spaceType: 'land', bonus: [2], edge: false, x: 8, y: 4},
      {id: '41', spaceType: 'land', bonus: [19], edge: false, x: 9, y: 4},
      {id: '42', spaceType: 'ocean', bonus: [2, 2], edge: true, x: 10, y: 4},
      // y=5, x=0..10
      {id: '43', spaceType: 'land', bonus: [2], edge: true, x: 0, y: 5},
      {id: '44', spaceType: 'land', bonus: [2], edge: false, x: 1, y: 5},
      {id: '45', spaceType: 'land', bonus: [2, 2], edge: false, x: 2, y: 5},
      {id: '46', spaceType: 'land', bonus: [2, 2], edge: false, x: 3, y: 5},
      {id: '47', spaceType: 'ocean', bonus: [2, 2], edge: false, x: 4, y: 5},
      {id: '48', spaceType: 'ocean', bonus: [2, 2], edge: false, x: 5, y: 5},
      {id: '49', spaceType: 'land', bonus: [1, 2, 2], edge: false, x: 6, y: 5},
      {id: '50', spaceType: 'land', bonus: [2], edge: false, x: 7, y: 5},
      {id: '51', spaceType: 'land', bonus: [], edge: false, x: 8, y: 5},
      {id: '52', spaceType: 'land', bonus: [2], edge: false, x: 9, y: 5},
      {id: '53', spaceType: 'ocean', bonus: [3], edge: true, x: 10, y: 5},
      // y=6, x=1..10
      {id: '54', spaceType: 'land', bonus: [2], edge: true, x: 1, y: 6},
      {id: '55', spaceType: 'land', bonus: [2, 2], edge: false, x: 2, y: 6},
      {id: '56', spaceType: 'ocean', bonus: [2, 2], edge: false, x: 3, y: 6},
      {id: '57', spaceType: 'land', bonus: [9, 9], edge: false, x: 4, y: 6},
      {id: '58', spaceType: 'land', bonus: [9], edge: false, x: 5, y: 6},
      {id: '59', spaceType: 'land', bonus: [9, 9], edge: false, x: 6, y: 6},
      {id: '60', spaceType: 'land', bonus: [], edge: false, x: 7, y: 6},
      {id: '61', spaceType: 'land', bonus: [2], edge: false, x: 8, y: 6},
      {id: '62', spaceType: 'land', bonus: [2], edge: false, x: 9, y: 6},
      {id: '63', spaceType: 'land', bonus: [], edge: true, x: 10, y: 6},
      // y=7, x=2..10
      {id: '64', spaceType: 'land', bonus: [2], edge: true, x: 2, y: 7},
      {id: '65', spaceType: 'ocean', bonus: [3, 3], edge: false, x: 3, y: 7},
      {id: '66', spaceType: 'land', bonus: [2], edge: false, x: 4, y: 7},
      {id: '67', spaceType: 'land', bonus: [9], edge: false, x: 5, y: 7},
      {id: '68', spaceType: 'land', bonus: [9, 9], edge: false, x: 6, y: 7},
      {id: '69', spaceType: 'land', bonus: [2], edge: false, x: 7, y: 7},
      {id: '70', spaceType: 'land', volcanic: true, bonus: [16, 16], edge: false, x: 8, y: 7},
      {id: '71', spaceType: 'land', bonus: [1], edge: false, x: 9, y: 7},
      {id: '72', spaceType: 'land', volcanic: true, bonus: [16], edge: true, x: 10, y: 7},
      // y=8, x=3..10
      {id: '73', spaceType: 'ocean', bonus: [1, 0], edge: true, x: 3, y: 8},
      {id: '74', spaceType: 'land', bonus: [], edge: false, x: 4, y: 8},
      {id: '75', spaceType: 'land', bonus: [0], edge: false, x: 5, y: 8},
      {id: '76', spaceType: 'land', bonus: [], edge: false, x: 6, y: 8},
      {id: '77', spaceType: 'land', bonus: [], edge: false, x: 7, y: 8},
      {id: '78', spaceType: 'land', bonus: [2, 2], edge: false, x: 8, y: 8},
      {id: '79', spaceType: 'land', bonus: [], edge: false, x: 9, y: 8},
      {id: '80', spaceType: 'land', volcanic: true, bonus: [0], edge: true, x: 10, y: 8},
      // y=9, x=4..10
      {id: '81', spaceType: 'ocean', bonus: [], edge: true, x: 4, y: 9},
      {id: '82', spaceType: 'land', bonus: [], edge: false, x: 5, y: 9},
      {id: '83', spaceType: 'land', bonus: [19], edge: false, x: 6, y: 9},
      {id: '84', spaceType: 'land', bonus: [], edge: false, x: 7, y: 9},
      {id: '85', spaceType: 'land', bonus: [2, 2, 2], edge: false, x: 8, y: 9},
      {id: '86', spaceType: 'land', bonus: [2, 2], edge: false, x: 9, y: 9},
      {id: '87', spaceType: 'land', volcanic: true, bonus: [1, 1], edge: true, x: 10, y: 9},
      // y=10, x=5..10
      {id: '88', spaceType: 'land', bonus: [], edge: true, x: 5, y: 10},
      {id: '89', spaceType: 'land', bonus: [1, 0], edge: true, x: 6, y: 10},
      {id: '90', spaceType: 'land', bonus: [1, 1], edge: true, x: 7, y: 10},
      {id: '91', spaceType: 'land', bonus: [], edge: true, x: 8, y: 10},
      {id: '92', spaceType: 'land', bonus: [2], edge: true, x: 9, y: 10},
      {id: '93', spaceType: 'land', bonus: [3], edge: true, x: 10, y: 10},
    ]);
    expect(board.volcanicSpaceIds).deep.eq(['33', '70', '72', '80', '87']);
    expect(board.bottomRow).eq(10);
    expect(board.equatorRow).eq(5);
    expect(board.max.oceans).to.eq(11);
    expect(board.max.temperature).to.eq(14);
    expect(board.max.oxygen).to.eq(18);
    expect(board.max.venus).to.eq(36);
  });

  it('serialize/deserialize round-trip', () => {
    const [game, player] = testGame(2, {boardName: BoardName.AMAZONIS_PLANITIA});
    expect(game.board.spaces.filter((s) => s.spaceType !== SpaceType.COLONY)).has.length(91);

    const citySpace = game.board.getAvailableSpacesForType(player, 'city')[0];
    game.addCity(player, citySpace);

    const deserialized = Game.deserialize(game.serialize());
    expect(deserialized.board.spaces.filter((s) => s.spaceType !== SpaceType.COLONY)).has.length(91);
    expect(Board.isCitySpace(deserialized.board.getSpaceOrThrow(citySpace.id))).is.true;
  });

  it('getAdjacentSpaces', () => {
    const board = AmazonisPlanitiaBoard.newInstance(DEFAULT_GAME_OPTIONS, new SeededRandom(0));
    const expectedAdjacentSpaces: Map<string, Array<string>> = new Map([
      ['c01', []],
      ['c02', []],
      // y=0 (upper half: bottomLeft[0]--, topRight[0]++)
      ['03', ['04', '10', '09']],
      ['04', ['05', '11', '10', '03']],
      ['05', ['06', '12', '11', '04']],
      ['06', ['07', '13', '12', '05']],
      ['07', ['08', '14', '13', '06']],
      ['08', ['15', '14', '07']],
      // y=1 (upper half)
      ['09', ['03', '10', '17', '16']],
      ['10', ['03', '04', '11', '18', '17', '09']],
      ['11', ['04', '05', '12', '19', '18', '10']],
      ['12', ['05', '06', '13', '20', '19', '11']],
      ['13', ['06', '07', '14', '21', '20', '12']],
      ['14', ['07', '08', '15', '22', '21', '13']],
      ['15', ['08', '23', '22', '14']],
      // y=2 (upper half)
      ['16', ['09', '17', '25', '24']],
      ['17', ['09', '10', '18', '26', '25', '16']],
      ['18', ['10', '11', '19', '27', '26', '17']],
      ['19', ['11', '12', '20', '28', '27', '18']],
      ['20', ['12', '13', '21', '29', '28', '19']],
      ['21', ['13', '14', '22', '30', '29', '20']],
      ['22', ['14', '15', '23', '31', '30', '21']],
      ['23', ['15', '32', '31', '22']],
      // y=3 (upper half)
      ['24', ['16', '25', '34', '33']],
      ['25', ['16', '17', '26', '35', '34', '24']],
      ['26', ['17', '18', '27', '36', '35', '25']],
      ['27', ['18', '19', '28', '37', '36', '26']],
      ['28', ['19', '20', '29', '38', '37', '27']],
      ['29', ['20', '21', '30', '39', '38', '28']],
      ['30', ['21', '22', '31', '40', '39', '29']],
      ['31', ['22', '23', '32', '41', '40', '30']],
      ['32', ['23', '42', '41', '31']],
      // y=4 (upper half)
      ['33', ['24', '34', '44', '43']],
      ['34', ['24', '25', '35', '45', '44', '33']],
      ['35', ['25', '26', '36', '46', '45', '34']],
      ['36', ['26', '27', '37', '47', '46', '35']],
      ['37', ['27', '28', '38', '48', '47', '36']],
      ['38', ['28', '29', '39', '49', '48', '37']],
      ['39', ['29', '30', '40', '50', '49', '38']],
      ['40', ['30', '31', '41', '51', '50', '39']],
      ['41', ['31', '32', '42', '52', '51', '40']],
      ['42', ['32', '53', '52', '41']],
      // y=5 (middle row: bottomRight[0]++, topRight[0]++)
      ['43', ['33', '44', '54']],
      ['44', ['33', '34', '45', '55', '54', '43']],
      ['45', ['34', '35', '46', '56', '55', '44']],
      ['46', ['35', '36', '47', '57', '56', '45']],
      ['47', ['36', '37', '48', '58', '57', '46']],
      ['48', ['37', '38', '49', '59', '58', '47']],
      ['49', ['38', '39', '50', '60', '59', '48']],
      ['50', ['39', '40', '51', '61', '60', '49']],
      ['51', ['40', '41', '52', '62', '61', '50']],
      ['52', ['41', '42', '53', '63', '62', '51']],
      ['53', ['42', '63', '52']],
      // y=6 (lower half: bottomRight[0]++, topLeft[0]--)
      ['54', ['43', '44', '55', '64']],
      ['55', ['44', '45', '56', '65', '64', '54']],
      ['56', ['45', '46', '57', '66', '65', '55']],
      ['57', ['46', '47', '58', '67', '66', '56']],
      ['58', ['47', '48', '59', '68', '67', '57']],
      ['59', ['48', '49', '60', '69', '68', '58']],
      ['60', ['49', '50', '61', '70', '69', '59']],
      ['61', ['50', '51', '62', '71', '70', '60']],
      ['62', ['51', '52', '63', '72', '71', '61']],
      ['63', ['52', '53', '72', '62']],
      // y=7 (lower half)
      ['64', ['54', '55', '65', '73']],
      ['65', ['55', '56', '66', '74', '73', '64']],
      ['66', ['56', '57', '67', '75', '74', '65']],
      ['67', ['57', '58', '68', '76', '75', '66']],
      ['68', ['58', '59', '69', '77', '76', '67']],
      ['69', ['59', '60', '70', '78', '77', '68']],
      ['70', ['60', '61', '71', '79', '78', '69']],
      ['71', ['61', '62', '72', '80', '79', '70']],
      ['72', ['62', '63', '80', '71']],
      // y=8 (lower half)
      ['73', ['64', '65', '74', '81']],
      ['74', ['65', '66', '75', '82', '81', '73']],
      ['75', ['66', '67', '76', '83', '82', '74']],
      ['76', ['67', '68', '77', '84', '83', '75']],
      ['77', ['68', '69', '78', '85', '84', '76']],
      ['78', ['69', '70', '79', '86', '85', '77']],
      ['79', ['70', '71', '80', '87', '86', '78']],
      ['80', ['71', '72', '87', '79']],
      // y=9 (lower half)
      ['81', ['73', '74', '82', '88']],
      ['82', ['74', '75', '83', '89', '88', '81']],
      ['83', ['75', '76', '84', '90', '89', '82']],
      ['84', ['76', '77', '85', '91', '90', '83']],
      ['85', ['77', '78', '86', '92', '91', '84']],
      ['86', ['78', '79', '87', '93', '92', '85']],
      ['87', ['79', '80', '93', '86']],
      // y=10 (lower half)
      ['88', ['81', '82', '89']],
      ['89', ['82', '83', '90', '88']],
      ['90', ['83', '84', '91', '89']],
      ['91', ['84', '85', '92', '90']],
      ['92', ['85', '86', '93', '91']],
      ['93', ['86', '87', '92']],
    ]);
    board.spaces.forEach((space) => {
      const expected = expectedAdjacentSpaces.get(space.id);
      const actual = board.getAdjacentSpaces(space).map(toID);
      expect(expected, `space ${space.id}`).to.eql(actual);
    });
  });

  it('colony spaces have no adjacency', () => {
    const board = AmazonisPlanitiaBoard.newInstance(DEFAULT_GAME_OPTIONS, new SeededRandom(0));
    const colonySpaces = board.spaces.filter((s) => s.spaceType === SpaceType.COLONY);
    expect(colonySpaces).has.length(2);
    for (const space of colonySpaces) {
      expect(board.getAdjacentSpaces(space)).to.be.empty;
    }
  });

  describe('tests that need a game', () => {
    let game: IGame;
    let player: TestPlayer;
    let player2: TestPlayer;
    let board: AmazonisPlanitiaBoard;

    beforeEach(() => {
      [game, player, player2] = testGame(2, {boardName: BoardName.AMAZONIS_PLANITIA});
      board = cast(game.board, AmazonisPlanitiaBoard);
    });

    it('max.temperature is 14', () => {
      expect(game.max.temperature).to.eq(14);
    });

    it('max.oxygen is 18', () => {
      expect(game.max.oxygen).to.eq(18);
    });

    it('max.oceans is 11', () => {
      expect(game.max.oceans).to.eq(11);
    });

    it('does not cap temperature at +8 on the larger board', () => {
      setTemperature(game, 12);
      const initialTR = player.terraformRating;
      game.increaseTemperature(player, 2);
      expect(game.getTemperature()).to.eq(14);
      expect(player.terraformRating).to.eq(initialTR + 1);
    });

    it('does not cap oxygen at 14% on the larger board', () => {
      setOxygenLevel(game, 17);
      const initialTR = player.terraformRating;
      game.increaseOxygenLevel(player, 2);
      expect(game.getOxygenLevel()).to.eq(18);
      expect(player.terraformRating).to.eq(initialTR + 1);
    });

    it('does not cap oceans at 9 on the larger board', () => {
      maxOutOceans(player, 11);
      expect(game.board.getOceanSpaces()).has.length(11);
      expect(game.canAddOcean()).to.be.false;
    });

    it('isTerraformed requires temperature +14 on larger board', () => {
      setTemperature(game, 8);
      setOxygenLevel(game, constants.MAX_OXYGEN_LEVEL);
      maxOutOceans(player, constants.MAX_OCEAN_TILES);
      expect(game.marsIsTerraformed()).to.be.false;
      setTemperature(game, 14);
      expect(game.marsIsTerraformed()).to.be.false; // oxygen and oceans still wrong
    });

    it('isTerraformed requires oxygen 18 on larger board', () => {
      setTemperature(game, 14);
      setOxygenLevel(game, 14);
      maxOutOceans(player, constants.MAX_OCEAN_TILES);
      expect(game.marsIsTerraformed()).to.be.false;
      setOxygenLevel(game, 18);
      expect(game.marsIsTerraformed()).to.be.false; // oceans still wrong
    });

    it('isTerraformed requires 11 oceans on larger board', () => {
      setTemperature(game, 14);
      setOxygenLevel(game, 18);
      maxOutOceans(player, constants.MAX_OCEAN_TILES);
      expect(game.marsIsTerraformed()).to.be.false; // only 9 oceans
      maxOutOceans(player, 11);
      expect(game.marsIsTerraformed()).to.be.true;
    });

    it('edges', () => {
      expect(board.spaces.filter((s) => s.edge).map(toID)).to.have.members([
      // Top row (y=0)
        '03', '04', '05', '06', '07', '08',
        // Top-left diagonal (y+x=5, not in top row)
        '09', '16', '24', '33', '43',
        // Bottom-left diagonal (y-x=5, not in top-left diagonal or bottom row)
        '54', '64', '73', '81',
        // Bottom row (y=10)
        '88', '89', '90', '91', '92', '93',
        // Right column bottom (x=10, y=6..9, not in bottom row)
        '87', '80', '72', '63',
        // Right column full (x=10, y=5..1, not in top row)
        '53', '42', '32', '23', '15',
      ]);
    });

    it('getAvailableSpacesForGreenery - no tiles placed', () => {
      const availableSpaces = board.getAvailableSpacesForGreenery(player);
      expect(availableSpaces).has.lengthOf(board.getAvailableSpacesOnLand(player).length);
    });

    it('getAvailableSpacesForGreenery - adjacent tile owned', () => {
    // Place player's tile at space 05 (land, y=0, x=7)
      board.spaces[4].player = player;
      board.spaces[4].tile = {tileType: TileType.GREENERY};
      // Place player2's tile adjacent to player's tile
      board.spaces[9].player = player2;
      board.spaces[9].tile = {tileType: TileType.GREENERY};
      const availableSpaces = board.getAvailableSpacesForGreenery(player);
      // Since player's tile at 05 is adjacent to 04(ocean), 11, 10, 07, player can only place next to their tile
      expect(availableSpaces.length).to.be.greaterThan(0);
      expect(availableSpaces.length).to.be.lessThan(board.getAvailableSpacesOnLand(player).length);
    });
  });
});
