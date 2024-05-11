import {expect} from 'chai';
import {IGame} from '../../src/server/IGame';
import {ArabiaTerraBoard} from '../../src/server/boards/ArabiaTerraBoard';
import {TileType} from '../../src/common/TileType';
import {SpaceType} from '../../src/common/boards/SpaceType';
import {TestPlayer} from '../TestPlayer';
import {SpaceBonus} from '../../src/common/boards/SpaceBonus';
import {runAllActions, cast} from '../TestingUtils';
import {BoardName} from '../../src/common/boards/BoardName';
import {ProcessorFactory} from '../../src/server/cards/moon/ProcessorFactory';
import {SearchForLife} from '../../src/server/cards/base/SearchForLife';
import {Decomposers} from '../../src/server/cards/base/Decomposers';
import {LandClaim} from '../../src/server/cards/base/LandClaim';
import {SelectSpace} from '../../src/server/inputs/SelectSpace';
import {testGame} from '../TestGame';
import {DEFAULT_GAME_OPTIONS} from '../../src/server/game/GameOptions';
import {SeededRandom} from '../../src/common/utils/Random';

describe('ArabiaTerraBoard', function() {
  let board: ArabiaTerraBoard;
  let game: IGame;
  let player: TestPlayer;

  beforeEach(function() {
    [game, player/* , player2 */] = testGame(2, {boardName: BoardName.ARABIA_TERRA});
    board = cast(game.board, ArabiaTerraBoard);
  });

  it('sanity test', function() {
    const board = ArabiaTerraBoard.newInstance(DEFAULT_GAME_OPTIONS, new SeededRandom(0));
    expect(board.spaces).to.deep.eq([
      {'id': '01', 'spaceType': 'colony', 'x': -1, 'y': -1, 'bonus': []},
      {'id': '02', 'spaceType': 'colony', 'x': -1, 'y': -1, 'bonus': []},
      {'id': '03', 'spaceType': 'ocean', 'x': 4, 'y': 0, 'bonus': []},
      {'id': '04', 'spaceType': 'ocean', 'x': 5, 'y': 0, 'bonus': [2]},
      {'id': '05', 'spaceType': 'land', 'x': 6, 'y': 0, 'bonus': []},
      {'id': '06', 'spaceType': 'land', 'x': 7, 'y': 0, 'bonus': []},
      {'id': '07', 'spaceType': 'ocean', 'x': 8, 'y': 0, 'bonus': [3, 3]},
      {'id': '08', 'spaceType': 'ocean', 'x': 3, 'y': 1, 'bonus': [8, 8, 3]},
      {'id': '09', 'spaceType': 'ocean', 'x': 4, 'y': 1, 'bonus': [2]},
      {'id': '10', 'spaceType': 'land', 'x': 5, 'y': 1, 'bonus': [2, 2]},
      {'id': '11', 'spaceType': 'land', 'x': 6, 'y': 1, 'bonus': []},
      {'id': '12', 'spaceType': 'land', 'x': 7, 'y': 1, 'bonus': [2]},
      {'id': '13', 'spaceType': 'land', 'x': 8, 'y': 1, 'bonus': [2]},
      {'id': '14', 'spaceType': 'land', 'x': 2, 'y': 2, 'bonus': [2, 1]},
      {'id': '15', 'spaceType': 'ocean', 'x': 3, 'y': 2, 'bonus': [2]},
      {'id': '16', 'spaceType': 'land', 'x': 4, 'y': 2, 'bonus': [10, 10, 3]},
      {'id': '17', 'spaceType': 'land', 'x': 5, 'y': 2, 'bonus': [1]},
      {'id': '18', 'spaceType': 'land', 'x': 6, 'y': 2, 'bonus': [1]},
      {'id': '19', 'spaceType': 'land', 'x': 7, 'y': 2, 'bonus': [1, 2]},
      {'id': '20', 'spaceType': 'cove', 'x': 8, 'y': 2, 'bonus': [1, 0]},
      {'id': '21', 'spaceType': 'land', 'x': 1, 'y': 3, 'bonus': [2, 2]},
      {'id': '22', 'spaceType': 'land', 'x': 2, 'y': 3, 'bonus': [2]},
      {'id': '23', 'spaceType': 'ocean', 'x': 3, 'y': 3, 'bonus': [2, 2]},
      {'id': '24', 'spaceType': 'land', 'x': 4, 'y': 3, 'bonus': []},
      {'id': '25', 'spaceType': 'land', 'x': 5, 'y': 3, 'bonus': []},
      {'id': '26', 'spaceType': 'land', 'x': 6, 'y': 3, 'bonus': []},
      {'id': '27', 'spaceType': 'land', 'x': 7, 'y': 3, 'bonus': [1, 1]},
      {'id': '28', 'spaceType': 'land', 'x': 8, 'y': 3, 'bonus': []},
      {'id': '29', 'spaceType': 'land', 'x': 0, 'y': 4, 'bonus': []},
      {'id': '30', 'spaceType': 'land', 'x': 1, 'y': 4, 'bonus': []},
      {'id': '31', 'spaceType': 'ocean', 'x': 2, 'y': 4, 'bonus': [1]},
      {'id': '32', 'spaceType': 'cove', 'x': 3, 'y': 4, 'bonus': [12]},
      {'id': '33', 'spaceType': 'ocean', 'x': 4, 'y': 4, 'bonus': [2, 2]},
      {'id': '34', 'spaceType': 'land', 'x': 5, 'y': 4, 'bonus': [11, 3, 1]},
      {'id': '35', 'spaceType': 'land', 'x': 6, 'y': 4, 'bonus': []},
      {'id': '36', 'spaceType': 'land', 'x': 7, 'y': 4, 'bonus': []},
      {'id': '37', 'spaceType': 'land', 'x': 8, 'y': 4, 'bonus': []},
      {'id': '38', 'spaceType': 'land', 'x': 1, 'y': 5, 'bonus': [2]},
      {'id': '39', 'spaceType': 'land', 'x': 2, 'y': 5, 'bonus': [2]},
      {'id': '40', 'spaceType': 'ocean', 'x': 3, 'y': 5, 'bonus': [1, 1]},
      {'id': '41', 'spaceType': 'land', 'x': 4, 'y': 5, 'bonus': [2]},
      {'id': '42', 'spaceType': 'land', 'x': 5, 'y': 5, 'bonus': [1]},
      {'id': '43', 'spaceType': 'land', 'x': 6, 'y': 5, 'bonus': []},
      {'id': '44', 'spaceType': 'cove', 'x': 7, 'y': 5, 'bonus': [2, 0]},
      {'id': '45', 'spaceType': 'land', 'x': 8, 'y': 5, 'bonus': [2]},
      {'id': '46', 'spaceType': 'cove', 'x': 2, 'y': 6, 'bonus': [2, 0]},
      {'id': '47', 'spaceType': 'ocean', 'x': 3, 'y': 6, 'bonus': [2, 2]},
      {'id': '48', 'spaceType': 'cove', 'x': 4, 'y': 6, 'bonus': [2, 2]},
      {'id': '49', 'spaceType': 'land', 'x': 5, 'y': 6, 'bonus': [2]},
      {'id': '50', 'spaceType': 'land', 'x': 6, 'y': 6, 'bonus': [1]},
      {'id': '51', 'spaceType': 'land', 'x': 7, 'y': 6, 'bonus': [2, 0]},
      {'id': '52', 'spaceType': 'land', 'x': 8, 'y': 6, 'bonus': [0, 0]},
      {'id': '53', 'spaceType': 'ocean', 'x': 3, 'y': 7, 'bonus': [2, 2]},
      {'id': '54', 'spaceType': 'land', 'x': 4, 'y': 7, 'bonus': [2]},
      {'id': '55', 'spaceType': 'land', 'x': 5, 'y': 7, 'bonus': [1, 3]},
      {'id': '56', 'spaceType': 'land', 'x': 6, 'y': 7, 'bonus': [1, 1]},
      {'id': '57', 'spaceType': 'land', 'x': 7, 'y': 7, 'bonus': [1]},
      {'id': '58', 'spaceType': 'land', 'x': 8, 'y': 7, 'bonus': [3]},
      {'id': '59', 'spaceType': 'land', 'x': 4, 'y': 8, 'bonus': []},
      {'id': '60', 'spaceType': 'land', 'x': 5, 'y': 8, 'bonus': []},
      {'id': '61', 'spaceType': 'land', 'x': 6, 'y': 8, 'bonus': []},
      {'id': '62', 'spaceType': 'land', 'x': 7, 'y': 8, 'bonus': []},
      {'id': '63', 'spaceType': 'land', 'x': 8, 'y': 8, 'bonus': [1]},
      {'id': '69', 'spaceType': 'colony', 'x': -1, 'y': -1, 'bonus': []},
    ]);
  });

  it('Can place an ocean in a cove', () => {
    const coveSpace = board.getSpaces(SpaceType.COVE)[0];
    const availableSpaces = board.getAvailableSpacesForOcean(player);

    expect(availableSpaces).includes(coveSpace);
    game.addTile(player, coveSpace, {tileType: TileType.OCEAN});

    // No further assertions. addTile not throwing is enough.
  });

  it('Can place a forest in a cove', () => {
    const coveSpace = board.getSpaces(SpaceType.COVE)[0];
    const availableSpaces = board.getAvailableSpacesForGreenery(player);

    expect(availableSpaces).includes(coveSpace);
    game.addTile(player, coveSpace, {tileType: TileType.GREENERY});

    // No further assertions. addTile not throwing is enough.
  });

  it('Grants data bonus', () => {
    const card = new ProcessorFactory();
    player.playedCards.push(card);
    const space = board.spaces.find((space) => space.bonus.includes(SpaceBonus.DATA))!;

    game.addTile(player, space, {tileType: TileType.CITY});
    runAllActions(game);

    // one map space has data, and it has two of them.
    expect(card.resourceCount).eq(2);
  });

  it('Grants science bonus', () => {
    const card = new SearchForLife();
    player.playedCards.push(card);
    // one map space has science, and it has one of them.
    const space = board.spaces.find((space) => space.bonus.includes(SpaceBonus.SCIENCE))!;

    game.addTile(player, space, {tileType: TileType.CITY});
    runAllActions(game);

    expect(card.resourceCount).eq(1);
  });

  it('Grants energy production bonus', () => {
    const space = board.spaces.find((space) => space.bonus.includes(SpaceBonus.ENERGY_PRODUCTION))!;
    expect(player.production.energy).eq(0);

    game.addTile(player, space, {tileType: TileType.CITY});
    runAllActions(game);

    expect(player.production.energy).eq(1);
  });

  it('Grants microbe bonus', () => {
    const card = new Decomposers();
    player.playedCards.push(card);
    // one map space has microbes, and it has two of them.
    const space = board.spaces.find((space) => space.bonus.includes(SpaceBonus.MICROBE))!;

    game.addTile(player, space, {tileType: TileType.CITY});
    runAllActions(game);

    expect(card.resourceCount).eq(2);
  });

  it('Can land-claim, and then place on, a cove space', () => {
    const landClaim = new LandClaim();
    const selectSpace = cast(landClaim.play(player), SelectSpace);
    const space = board.getSpaces(SpaceType.COVE)[0];
    expect(selectSpace.spaces.map((space) => space.id)).contains(space.id);

    selectSpace.cb(space);

    expect(space.player?.id).equals(player.id);

    player.game.addOcean(player, space);

    expect(space.tile?.tileType).equals(TileType.OCEAN);
  });
});
