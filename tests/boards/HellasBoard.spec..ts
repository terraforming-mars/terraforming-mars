import {expect} from 'chai';
import {testGame} from '../TestGame';
import {Game} from '../../src/server/Game';
import {TestPlayer} from '../TestPlayer';
import {BoardName} from '../../src/common/boards/BoardName';
import {SpaceName} from '../../src/server/SpaceName';
import {HellasBoard} from '../../src/server/boards/HellasBoard';
import {TileType} from '../../src/common/TileType';

describe('HellasBoard', function() {
  let board: HellasBoard;
  let game: Game;
  let player: TestPlayer;
  let player2: TestPlayer;

  beforeEach(function() {
    [game, player, player2] = testGame(2, {boardName: BoardName.HELLAS, aresExtension: true});
    board = game.board as HellasBoard;
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
});
