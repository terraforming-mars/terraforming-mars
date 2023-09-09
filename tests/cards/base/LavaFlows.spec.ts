import {expect} from 'chai';
import {LavaFlows} from '../../../src/server/cards/base/LavaFlows';
import {Game} from '../../../src/server/Game';
import {SpaceName} from '../../../src/server/SpaceName';
import {TileType} from '../../../src/common/TileType';
import {cast, resetBoard, runAllActions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {BoardName} from '../../../src/common/boards/BoardName';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';

describe('LavaFlows', function() {
  let card: LavaFlows;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new LavaFlows();
    [game, player] = testGame(2);
    resetBoard(game);
  });

  it('Cannot play if no available spaces', function() {
    game.addTile(player, game.board.getSpace(SpaceName.THARSIS_THOLUS), {tileType: TileType.LAVA_FLOWS});
    game.addTile(player, game.board.getSpace(SpaceName.ARSIA_MONS), {tileType: TileType.LAVA_FLOWS});
    game.addTile(player, game.board.getSpace(SpaceName.PAVONIS_MONS), {tileType: TileType.LAVA_FLOWS});

    expect(card.canPlay(player)).is.true;

    const anotherPlayer = TestPlayer.RED.newPlayer();
    game.board.getSpace(SpaceName.ASCRAEUS_MONS).player = anotherPlayer; // land claim
    expect(card.canPlay(player)).is.not.true;
  });

  it('All land spaces are available on Hellas', function() {
    // With two players, there's no solo setup, so all spaces will be available.
    [game, player] = testGame(2, {boardName: BoardName.HELLAS});

    expect(card.play(player)).is.undefined;
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectSpace);
    expect(action.spaces).deep.eq(game.board.getAvailableSpacesOnLand(player));
  });

  it('Ares hazards do not disrupt Lava Flow space selection', function() {
    card.play(player);
    runAllActions(game);
    expect(cast(player.popWaitingFor(), SelectSpace).spaces).has.length(4);

    card.play(player);
    runAllActions(game);
    expect(cast(player.popWaitingFor(), SelectSpace).spaces.map((space) => space.id))
      .has.members([SpaceName.ARSIA_MONS, SpaceName.PAVONIS_MONS, SpaceName.ASCRAEUS_MONS, SpaceName.THARSIS_THOLUS]);

    game.board.getSpace(SpaceName.THARSIS_THOLUS).tile = {tileType: TileType.EROSION_MILD, protectedHazard: false};

    card.play(player);
    runAllActions(game);
    expect(cast(player.popWaitingFor(), SelectSpace).spaces).has.length(4);

    game.board.getSpace(SpaceName.THARSIS_THOLUS).tile = {tileType: TileType.CITY};
    card.play(player);
    runAllActions(game);
    expect(cast(player.popWaitingFor(), SelectSpace).spaces).has.length(3);

    card.play(player);
    runAllActions(game);
    expect(cast(player.popWaitingFor(), SelectSpace).spaces.map((space) => space.id))
      .has.members([SpaceName.ARSIA_MONS, SpaceName.PAVONIS_MONS, SpaceName.ASCRAEUS_MONS]);
  });

  it('Should play', function() {
    expect(card.play(player)).is.undefined;
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectSpace);
    const space = action.spaces[0];
    action.cb(space);

    expect(space.tile!.tileType).to.eq(TileType.LAVA_FLOWS);
    expect(space.player).to.eq(player);
    expect(game.getTemperature()).to.eq(-26);
    expect(space.adjacency?.bonus).eq(undefined);
  });
});
