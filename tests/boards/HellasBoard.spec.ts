import {expect} from 'chai';
import {testGame} from '../TestGame';
import {IGame} from '../../src/server/IGame';
import {TestPlayer} from '../TestPlayer';
import {BoardName} from '../../src/common/boards/BoardName';
import {SpaceName} from '../../src/server/SpaceName';
import {HellasBoard} from '../../src/server/boards/HellasBoard';
import {cast, runAllActions} from '../TestingUtils';
import {DEFAULT_GAME_OPTIONS} from '../../src/server/game/GameOptions';
import {SeededRandom} from '../../src/common/utils/Random';
import {Manutech} from '../../src/server/cards/venusNext/Manutech';
import {DomedCrater} from '../../src/server/cards/base/DomedCrater';
import {Resource} from '../../src/common/Resource';
import {SelectSpace} from '../../src/server/inputs/SelectSpace';

describe('HellasBoard', function() {
  let board: HellasBoard;
  let game: IGame;
  let player: TestPlayer;

  beforeEach(function() {
    [game, player/* , player2 */] = testGame(2, {boardName: BoardName.HELLAS, aresExtension: true});
    board = cast(game.board, HellasBoard);
  });

  it('sanity test', function() {
    const board = HellasBoard.newInstance(DEFAULT_GAME_OPTIONS, new SeededRandom(0));
    expect(board.spaces).to.deep.eq([
      {'id': '01', 'spaceType': 'colony', 'x': -1, 'y': -1, 'bonus': []},
      {'id': '02', 'spaceType': 'colony', 'x': -1, 'y': -1, 'bonus': []},
      {'id': '03', 'spaceType': 'ocean', 'x': 4, 'y': 0, 'bonus': [2, 2]},
      {'id': '04', 'spaceType': 'land', 'x': 5, 'y': 0, 'bonus': [2, 2]},
      {'id': '05', 'spaceType': 'land', 'x': 6, 'y': 0, 'bonus': [2, 2]},
      {'id': '06', 'spaceType': 'land', 'x': 7, 'y': 0, 'bonus': [2, 1]},
      {'id': '07', 'spaceType': 'land', 'x': 8, 'y': 0, 'bonus': [2]},
      {'id': '08', 'spaceType': 'ocean', 'x': 3, 'y': 1, 'bonus': [2, 2]},
      {'id': '09', 'spaceType': 'land', 'x': 4, 'y': 1, 'bonus': [2, 2]},
      {'id': '10', 'spaceType': 'land', 'x': 5, 'y': 1, 'bonus': [2]},
      {'id': '11', 'spaceType': 'land', 'x': 6, 'y': 1, 'bonus': [2, 1]},
      {'id': '12', 'spaceType': 'land', 'x': 7, 'y': 1, 'bonus': [2]},
      {'id': '13', 'spaceType': 'land', 'x': 8, 'y': 1, 'bonus': [2]},
      {'id': '14', 'spaceType': 'ocean', 'x': 2, 'y': 2, 'bonus': [2]},
      {'id': '15', 'spaceType': 'land', 'x': 3, 'y': 2, 'bonus': [2]},
      {'id': '16', 'spaceType': 'land', 'x': 4, 'y': 2, 'bonus': [1]},
      {'id': '17', 'spaceType': 'land', 'x': 5, 'y': 2, 'bonus': [1]},
      {'id': '18', 'spaceType': 'land', 'x': 6, 'y': 2, 'bonus': []},
      {'id': '19', 'spaceType': 'land', 'x': 7, 'y': 2, 'bonus': [2, 2]},
      {'id': '20', 'spaceType': 'land', 'x': 8, 'y': 2, 'bonus': [2, 3]},
      {'id': '21', 'spaceType': 'ocean', 'x': 1, 'y': 3, 'bonus': [2]},
      {'id': '22', 'spaceType': 'land', 'x': 2, 'y': 3, 'bonus': [2]},
      {'id': '23', 'spaceType': 'land', 'x': 3, 'y': 3, 'bonus': [1]},
      {'id': '24', 'spaceType': 'land', 'x': 4, 'y': 3, 'bonus': [1, 1]},
      {'id': '25', 'spaceType': 'land', 'x': 5, 'y': 3, 'bonus': [1]},
      {'id': '26', 'spaceType': 'ocean', 'x': 6, 'y': 3, 'bonus': [2]},
      {'id': '27', 'spaceType': 'ocean', 'x': 7, 'y': 3, 'bonus': [2]},
      {'id': '28', 'spaceType': 'land', 'x': 8, 'y': 3, 'bonus': [2]},
      {'id': '29', 'spaceType': 'land', 'x': 0, 'y': 4, 'bonus': [3]},
      {'id': '30', 'spaceType': 'land', 'x': 1, 'y': 4, 'bonus': []},
      {'id': '31', 'spaceType': 'land', 'x': 2, 'y': 4, 'bonus': []},
      {'id': '32', 'spaceType': 'land', 'x': 3, 'y': 4, 'bonus': [1, 1]},
      {'id': '33', 'spaceType': 'land', 'x': 4, 'y': 4, 'bonus': []},
      {'id': '34', 'spaceType': 'ocean', 'x': 5, 'y': 4, 'bonus': [3]},
      {'id': '35', 'spaceType': 'ocean', 'x': 6, 'y': 4, 'bonus': [4, 4, 4]},
      {'id': '36', 'spaceType': 'ocean', 'x': 7, 'y': 4, 'bonus': []},
      {'id': '37', 'spaceType': 'land', 'x': 8, 'y': 4, 'bonus': [2]},
      {'id': '38', 'spaceType': 'land', 'x': 1, 'y': 5, 'bonus': [0]},
      {'id': '39', 'spaceType': 'land', 'x': 2, 'y': 5, 'bonus': []},
      {'id': '40', 'spaceType': 'land', 'x': 3, 'y': 5, 'bonus': [1]},
      {'id': '41', 'spaceType': 'land', 'x': 4, 'y': 5, 'bonus': []},
      {'id': '42', 'spaceType': 'land', 'x': 5, 'y': 5, 'bonus': []},
      {'id': '43', 'spaceType': 'ocean', 'x': 6, 'y': 5, 'bonus': []},
      {'id': '44', 'spaceType': 'ocean', 'x': 7, 'y': 5, 'bonus': [1]},
      {'id': '45', 'spaceType': 'land', 'x': 8, 'y': 5, 'bonus': []},
      {'id': '46', 'spaceType': 'ocean', 'x': 2, 'y': 6, 'bonus': [0, 0]},
      {'id': '47', 'spaceType': 'land', 'x': 3, 'y': 6, 'bonus': []},
      {'id': '48', 'spaceType': 'land', 'x': 4, 'y': 6, 'bonus': []},
      {'id': '49', 'spaceType': 'land', 'x': 5, 'y': 6, 'bonus': [3]},
      {'id': '50', 'spaceType': 'land', 'x': 6, 'y': 6, 'bonus': []},
      {'id': '51', 'spaceType': 'land', 'x': 7, 'y': 6, 'bonus': []},
      {'id': '52', 'spaceType': 'land', 'x': 8, 'y': 6, 'bonus': [0]},
      {'id': '53', 'spaceType': 'land', 'x': 3, 'y': 7, 'bonus': [1]},
      {'id': '54', 'spaceType': 'land', 'x': 4, 'y': 7, 'bonus': [3]},
      {'id': '55', 'spaceType': 'land', 'x': 5, 'y': 7, 'bonus': [4, 4]},
      {'id': '56', 'spaceType': 'land', 'x': 6, 'y': 7, 'bonus': [4, 4]},
      {'id': '57', 'spaceType': 'land', 'x': 7, 'y': 7, 'bonus': [0]},
      {'id': '58', 'spaceType': 'land', 'x': 8, 'y': 7, 'bonus': [0]},
      {'id': '59', 'spaceType': 'land', 'x': 4, 'y': 8, 'bonus': []},
      {'id': '60', 'spaceType': 'land', 'x': 5, 'y': 8, 'bonus': [4, 4]},
      {'id': '61', 'spaceType': 'land', 'x': 6, 'y': 8, 'bonus': [5]},
      {'id': '62', 'spaceType': 'land', 'x': 7, 'y': 8, 'bonus': [4, 4]},
      {'id': '63', 'spaceType': 'land', 'x': 8, 'y': 8, 'bonus': []},
      {'id': '69', 'spaceType': 'colony', 'x': -1, 'y': -1, 'bonus': []},
    ]);
  });

  it('Removes Hellas bonus ocean space if player cannot pay', () => {
    // Ensuring that HELLAS_OCEAN_TILE will be available for the test.
    expect(game.board.getSpaceOrThrow(SpaceName.HELLAS_OCEAN_TILE).tile).is.undefined;

    // Cannot afford
    player.megaCredits = 5;
    let availableSpacesOnLand = board.getAvailableSpacesOnLand(player);
    expect(availableSpacesOnLand.map((s) => s.id)).to.not.include(SpaceName.HELLAS_OCEAN_TILE);

    // Can afford
    player.megaCredits = 6;
    availableSpacesOnLand = board.getAvailableSpacesOnLand(player);
    expect(availableSpacesOnLand.map((s) => s.id)).to.include(SpaceName.HELLAS_OCEAN_TILE);
  });

  it('Calculate costs for Hellas ocean space with other costs (e.g. ares)', () => {
    // Cannot afford
    const oceanSpace = board.getSpaceOrThrow(SpaceName.HELLAS_OCEAN_TILE);
    const adjacentSpace = board.getAdjacentSpaces(oceanSpace)[0];
    adjacentSpace.adjacency = {bonus: [], cost: 3};

    player.megaCredits = 8;
    let availableSpacesOnLand = board.getAvailableSpacesOnLand(player);
    expect(availableSpacesOnLand.map((s) => s.id)).to.not.include(SpaceName.HELLAS_OCEAN_TILE);

    // Can afford
    player.megaCredits = 9;
    availableSpacesOnLand = board.getAvailableSpacesOnLand(player);
    expect(availableSpacesOnLand.map((s) => s.id)).to.include(SpaceName.HELLAS_OCEAN_TILE);
  });

  it('Cannot place on ocean space EVEN if Manutech can make up the difference - replicates #931', () => {
    player.corporations.push(new Manutech());
    const domedCrater = new DomedCrater();
    player.production.add(Resource.ENERGY, 1);
    domedCrater.play(player);
    runAllActions(game);
    const selectSpace = cast(player.popWaitingFor(), SelectSpace);
    // This is still a bug because this ought to be true.
    expect(selectSpace.spaces.map((s) => s.id)).to.not.include(SpaceName.HELLAS_OCEAN_TILE);
  });
});
