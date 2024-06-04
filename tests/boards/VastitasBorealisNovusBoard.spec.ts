import {expect} from 'chai';
import {VastitasBorealisNovusBoard} from '../../src/server/boards/VastitasBorealisNovusBoard';
import {addGreenery, cast, runAllActions} from '../TestingUtils';
import {BoardName} from '../../src/common/boards/BoardName';
import {testGame} from '../TestGame';
import {SpaceBonus} from '../../src/common/boards/SpaceBonus';
import {SelectParty} from '../../src/server/inputs/SelectParty';
import {DEFAULT_GAME_OPTIONS} from '../../src/server/game/GameOptions';
import {SeededRandom} from '../../src/common/utils/Random';
import {TileType} from '../../src/common/TileType';

describe('VastitasBorealisNovusBoard', function() {
  it('sanity test', function() {
    const board = VastitasBorealisNovusBoard.newInstance(DEFAULT_GAME_OPTIONS, new SeededRandom(0));
    expect(board.spaces).to.deep.eq([
      {'id': '01', 'spaceType': 'colony', 'x': -1, 'y': -1, 'bonus': []},
      {'id': '02', 'spaceType': 'colony', 'x': -1, 'y': -1, 'bonus': []},
      {'id': '03', 'spaceType': 'land', 'x': 4, 'y': 0, 'bonus': [2]},
      {'id': '04', 'spaceType': 'land', 'x': 5, 'y': 0, 'bonus': []},
      {'id': '05', 'spaceType': 'land', 'x': 6, 'y': 0, 'bonus': [1]},
      {'id': '06', 'spaceType': 'land', 'x': 7, 'y': 0, 'bonus': []},
      {'id': '07', 'spaceType': 'land', 'x': 8, 'y': 0, 'bonus': []},
      {'id': '08', 'spaceType': 'land', 'x': 3, 'y': 1, 'bonus': [2, 2]},
      {'id': '09', 'spaceType': 'land', 'x': 4, 'y': 1, 'bonus': [2, 2]},
      {'id': '10', 'spaceType': 'land', 'x': 5, 'y': 1, 'bonus': []},
      {'id': '11', 'spaceType': 'land', 'x': 6, 'y': 1, 'bonus': []},
      {'id': '12', 'spaceType': 'land', 'x': 7, 'y': 1, 'bonus': [2]},
      {'id': '13', 'spaceType': 'land', 'x': 8, 'y': 1, 'bonus': [3]},
      {'id': '14', 'spaceType': 'land', 'x': 2, 'y': 2, 'bonus': [3]},
      {'id': '15', 'spaceType': 'ocean', 'x': 3, 'y': 2, 'bonus': [2, 2]},
      {'id': '16', 'spaceType': 'ocean', 'x': 4, 'y': 2, 'bonus': [2, 2]},
      {'id': '17', 'spaceType': 'land', 'x': 5, 'y': 2, 'bonus': [2, 2]},
      {'id': '18', 'spaceType': 'land', 'x': 6, 'y': 2, 'bonus': [2]},
      {'id': '19', 'spaceType': 'land', 'x': 7, 'y': 2, 'bonus': []},
      {'id': '20', 'spaceType': 'land', 'x': 8, 'y': 2, 'bonus': []},
      {'id': '21', 'spaceType': 'land', 'x': 1, 'y': 3, 'bonus': [1, 1]},
      {'id': '22', 'spaceType': 'land', 'x': 2, 'y': 3, 'bonus': [0]},
      {'id': '23', 'spaceType': 'ocean', 'x': 3, 'y': 3, 'bonus': [2, 2]},
      {'id': '24', 'spaceType': 'land', 'x': 4, 'y': 3, 'bonus': [2]},
      {'id': '25', 'spaceType': 'land', 'x': 5, 'y': 3, 'bonus': []},
      {'id': '26', 'spaceType': 'land', 'x': 6, 'y': 3, 'bonus': [3]},
      {'id': '27', 'spaceType': 'land', 'x': 7, 'y': 3, 'bonus': [2]},
      {'id': '28', 'spaceType': 'land', 'x': 8, 'y': 3, 'bonus': [16]},
      {'id': '29', 'spaceType': 'land', 'x': 0, 'y': 4, 'bonus': []},
      {'id': '30', 'spaceType': 'land', 'x': 1, 'y': 4, 'bonus': []},
      {'id': '31', 'spaceType': 'ocean', 'x': 2, 'y': 4, 'bonus': [2]},
      {'id': '32', 'spaceType': 'land', 'x': 3, 'y': 4, 'bonus': [2, 2]},
      {'id': '33', 'spaceType': 'land', 'x': 4, 'y': 4, 'bonus': [13]},
      {'id': '34', 'spaceType': 'ocean', 'x': 5, 'y': 4, 'bonus': [2, 2]},
      {'id': '35', 'spaceType': 'ocean', 'x': 6, 'y': 4, 'bonus': [2, 2]},
      {'id': '36', 'spaceType': 'ocean', 'x': 7, 'y': 4, 'bonus': [2, 2]},
      {'id': '37', 'spaceType': 'land', 'x': 8, 'y': 4, 'bonus': [3, 3]},
      {'id': '38', 'spaceType': 'land', 'x': 1, 'y': 5, 'bonus': [3, 3]},
      {'id': '39', 'spaceType': 'land', 'x': 2, 'y': 5, 'bonus': []},
      {'id': '40', 'spaceType': 'land', 'x': 3, 'y': 5, 'bonus': [2]},
      {'id': '41', 'spaceType': 'ocean', 'x': 4, 'y': 5, 'bonus': [4, 4]},
      {'id': '42', 'spaceType': 'ocean', 'x': 5, 'y': 5, 'bonus': [4, 4, 2]},
      {'id': '43', 'spaceType': 'ocean', 'x': 6, 'y': 5, 'bonus': [3]},
      {'id': '44', 'spaceType': 'land', 'x': 7, 'y': 5, 'bonus': [2]},
      {'id': '45', 'spaceType': 'land', 'x': 8, 'y': 5, 'bonus': [0, 0]},
      {'id': '46', 'spaceType': 'land', 'x': 2, 'y': 6, 'bonus': [0]},
      {'id': '47', 'spaceType': 'land', 'x': 3, 'y': 6, 'bonus': [1]},
      {'id': '48', 'spaceType': 'ocean', 'x': 4, 'y': 6, 'bonus': []},
      {'id': '49', 'spaceType': 'ocean', 'x': 5, 'y': 6, 'bonus': [4, 4]},
      {'id': '50', 'spaceType': 'land', 'x': 6, 'y': 6, 'bonus': [2, 2]},
      {'id': '51', 'spaceType': 'land', 'x': 7, 'y': 6, 'bonus': [2]},
      {'id': '52', 'spaceType': 'land', 'x': 8, 'y': 6, 'bonus': []},
      {'id': '53', 'spaceType': 'land', 'x': 3, 'y': 7, 'bonus': [2]},
      {'id': '54', 'spaceType': 'land', 'x': 4, 'y': 7, 'bonus': []},
      {'id': '55', 'spaceType': 'land', 'x': 5, 'y': 7, 'bonus': [2]},
      {'id': '56', 'spaceType': 'land', 'x': 6, 'y': 7, 'bonus': [2, 1]},
      {'id': '57', 'spaceType': 'land', 'x': 7, 'y': 7, 'bonus': [1]},
      {'id': '58', 'spaceType': 'land', 'x': 8, 'y': 7, 'bonus': [2]},
      {'id': '59', 'spaceType': 'land', 'x': 4, 'y': 8, 'bonus': [16]},
      {'id': '60', 'spaceType': 'land', 'x': 5, 'y': 8, 'bonus': []},
      {'id': '61', 'spaceType': 'land', 'x': 6, 'y': 8, 'bonus': [3]},
      {'id': '62', 'spaceType': 'land', 'x': 7, 'y': 8, 'bonus': [1]},
      {'id': '63', 'spaceType': 'land', 'x': 8, 'y': 8, 'bonus': [0]},
      {'id': '69', 'spaceType': 'colony', 'x': -1, 'y': -1, 'bonus': []},
    ]);
  });

  it('Delegate bonuses work without Turmoil', () => {
    const [game, player] = testGame(2, {boardName: BoardName.VASTITAS_BOREALIS_NOVUS});
    const board = cast(game.board, VastitasBorealisNovusBoard);
    const delegateSpace = board.spaces.filter((space) => space.bonus.includes(SpaceBonus.DELEGATE))[0];
    expect(board.getAvailableSpacesOnLand(player, {cost: 0})).includes(delegateSpace);

    addGreenery(player, delegateSpace.id);
    runAllActions(game);
    expect(player.popWaitingFor()).is.undefined;
  });

  it('Delegate bonuses work with Turmoil', () => {
    const [game, player] = testGame(2, {boardName: BoardName.VASTITAS_BOREALIS_NOVUS, turmoilExtension: true});
    const board = cast(game.board, VastitasBorealisNovusBoard);
    const delegateSpace = board.spaces.filter((space) => space.bonus.includes(SpaceBonus.DELEGATE))[0];
    expect(board.getAvailableSpacesOnLand(player, {cost: 0})).includes(delegateSpace);

    addGreenery(player, delegateSpace.id);
    runAllActions(game);
    cast(player.popWaitingFor(), SelectParty);
  });

  it('Grants temperature bonus', () => {
    const [game, player] = testGame(2, {boardName: BoardName.VASTITAS_BOREALIS_NOVUS});
    const board = cast(game.board, VastitasBorealisNovusBoard);
    const space = board.spaces.find((space) => space.bonus.includes(SpaceBonus.TEMPERATURE))!;

    player.megaCredits = 2;
    expect(board.getAvailableSpacesOnLand(player).map((space) => space.id)).does.not.include(space.id);

    player.megaCredits = 3;
    expect(board.getAvailableSpacesOnLand(player).map((space) => space.id)).includes(space.id);
    expect(game.getTemperature()).eq(-30);

    game.addTile(player, space, {tileType: TileType.CITY});
    runAllActions(game);

    expect(player.megaCredits).eq(0);
    expect(game.getTemperature()).eq(-28);
  });
});
