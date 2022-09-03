import {expect} from 'chai';
import {LavaFlows} from '../../../src/server/cards/base/LavaFlows';
import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {SpaceName} from '../../../src/server/SpaceName';
import {SpaceType} from '../../../src/common/boards/SpaceType';
import {TileType} from '../../../src/common/TileType';
import {cast, resetBoard} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {newTestGame} from '../../TestGame';
import {BoardName} from '../../../src/common/boards/BoardName';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';

describe('LavaFlows', function() {
  let card: LavaFlows;
  let player: Player;
  let game: Game;

  beforeEach(function() {
    card = new LavaFlows();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
    resetBoard(game);
  });

  it('Cannot play if no available spaces', function() {
    game.addTile(player, SpaceType.LAND, game.board.getSpace(SpaceName.THARSIS_THOLUS), {tileType: TileType.LAVA_FLOWS});
    game.addTile(player, SpaceType.LAND, game.board.getSpace(SpaceName.ARSIA_MONS), {tileType: TileType.LAVA_FLOWS});
    game.addTile(player, SpaceType.LAND, game.board.getSpace(SpaceName.PAVONIS_MONS), {tileType: TileType.LAVA_FLOWS});

    expect(card.canPlay(player)).is.true;

    const anotherPlayer = TestPlayer.RED.newPlayer();
    game.board.getSpace(SpaceName.ASCRAEUS_MONS).player = anotherPlayer; // land claim
    expect(card.canPlay(player)).is.not.true;
  });

  it('All land spaces are available on Hellas', function() {
    // With two players, there's no solo setup, so all spaces will be available.
    const game = newTestGame(2, {boardName: BoardName.HELLAS});
    const player = game.getPlayersInGenerationOrder()[0];

    const action = cast(card.play(player), SelectSpace);
    expect(action.availableSpaces).deep.eq(game.board.getAvailableSpacesOnLand(player));
  });

  it('Ares hazards do not disrupt Lava Flow space selection', function() {
    expect(cast(card.play(player), SelectSpace).availableSpaces).has.length(4);
    expect(cast(card.play(player), SelectSpace).availableSpaces.map((space) => space.id))
      .has.members([SpaceName.ARSIA_MONS, SpaceName.PAVONIS_MONS, SpaceName.ASCRAEUS_MONS, SpaceName.THARSIS_THOLUS]);

    game.board.getSpace(SpaceName.THARSIS_THOLUS).tile = {tileType: TileType.EROSION_MILD, protectedHazard: false};
    expect(cast(card.play(player), SelectSpace).availableSpaces).has.length(4);
    game.board.getSpace(SpaceName.THARSIS_THOLUS).tile = {tileType: TileType.CITY};
    expect(cast(card.play(player), SelectSpace).availableSpaces).has.length(3);
    expect(cast(card.play(player), SelectSpace).availableSpaces.map((space) => space.id))
      .has.members([SpaceName.ARSIA_MONS, SpaceName.PAVONIS_MONS, SpaceName.ASCRAEUS_MONS]);
  });

  it('Should play', function() {
    const action = cast(card.play(player), SelectSpace);
    const space = action.availableSpaces[0];
    action.cb(space);

    expect(space.tile!.tileType).to.eq(TileType.LAVA_FLOWS);
    expect(space.player).to.eq(player);
    expect(game.getTemperature()).to.eq(-26);
    expect(space.adjacency?.bonus).eq(undefined);
  });
});
