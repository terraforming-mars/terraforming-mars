import {expect} from 'chai';
import {testGame} from '../TestGame';
import {Game} from '../../src/server/Game';
import {TestPlayer} from '../TestPlayer';
import {BoardName} from '../../src/common/boards/BoardName';
import {SpaceName} from '../../src/server/SpaceName';
import {HellasBoard} from '../../src/server/boards/HellasBoard';

describe('HellasBoard', function() {
  let board: HellasBoard;
  let game: Game;
  let player: TestPlayer;
  let player2: TestPlayer;

  beforeEach(function() {
    [game, player, player2] = testGame(2, {boardName: BoardName.HELLAS});
    board = game.board as HellasBoard;
  });

  it('Removes Hellas bonus ocean space if player cannot pay', () => {
    // Ensuring that HELLAS_OCEAN_TILE will be available for the test.
    expect(game.board.getSpace(SpaceName.HELLAS_OCEAN_TILE).tile).is.undefined;

    // Cannot afford
    player.megaCredits = 5;
    let availableSpacesOnLand = board.getAvailableSpacesOnLand(player);
    expect(availableSpacesOnLand.map((s) => s.id)).to.not.include(SpaceName.HELLAS_OCEAN_TILE);

    // Can afford
    player.megaCredits = 6;
    availableSpacesOnLand = board.getAvailableSpacesOnLand(player);
    expect(availableSpacesOnLand.map((s) => s.id)).to.include(SpaceName.HELLAS_OCEAN_TILE);
  });
});
