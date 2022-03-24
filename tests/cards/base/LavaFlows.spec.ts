import {expect} from 'chai';
import {LavaFlows} from '../../../src/cards/base/LavaFlows';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {SpaceName} from '../../../src/SpaceName';
import {SpaceType} from '../../../src/common/boards/SpaceType';
import {TileType} from '../../../src/common/TileType';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {newTestGame} from '../../TestGame';
import {BoardName} from '../../../src/common/boards/BoardName';

describe('LavaFlows', function() {
  let card: LavaFlows;
  let player: Player;
  let game: Game;

  beforeEach(function() {
    card = new LavaFlows();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
    TestingUtils.resetBoard(game);
  });

  it('Cannot play if no available spaces', function() {
    game.addTile(player, SpaceType.LAND, game.board.getSpace(SpaceName.THARSIS_THOLUS), {tileType: TileType.LAVA_FLOWS});
    game.addTile(player, SpaceType.LAND, game.board.getSpace(SpaceName.ARSIA_MONS), {tileType: TileType.LAVA_FLOWS});
    game.addTile(player, SpaceType.LAND, game.board.getSpace(SpaceName.PAVONIS_MONS), {tileType: TileType.LAVA_FLOWS});

    expect(card.canPlay(player)).is.true;

    const anotherPlayer = TestPlayers.RED.newPlayer();
    game.board.getSpace(SpaceName.ASCRAEUS_MONS).player = anotherPlayer; // land claim
    expect(card.canPlay(player)).is.not.true;
  });

  it('All land spaces are available on Hellas', function() {
    // With two players, there's no solo setup, so all spaces will be available.
    const game = newTestGame(2, {boardName: BoardName.HELLAS});
    const player = game.getPlayersInGenerationOrder()[0];

    const action = card.play(player);
    expect(action.availableSpaces).deep.eq(game.board.getAvailableSpacesOnLand(player));
  });

  it('Ares hazards do not disrupt Lava Flow space selection', function() {
    expect(card.play(player).availableSpaces).has.length(4);
    expect(card.play(player).availableSpaces.map((space) => space.id))
      .has.members([SpaceName.ARSIA_MONS, SpaceName.PAVONIS_MONS, SpaceName.ASCRAEUS_MONS, SpaceName.THARSIS_THOLUS]);

    game.board.getSpace(SpaceName.THARSIS_THOLUS).tile = {tileType: TileType.EROSION_MILD, protectedHazard: false};
    expect(card.play(player).availableSpaces).has.length(4);
    game.board.getSpace(SpaceName.THARSIS_THOLUS).tile = {tileType: TileType.CITY};
    expect(card.play(player).availableSpaces).has.length(3);
    expect(card.play(player).availableSpaces.map((space) => space.id))
      .has.members([SpaceName.ARSIA_MONS, SpaceName.PAVONIS_MONS, SpaceName.ASCRAEUS_MONS]);
  });

  it('Should play', function() {
    const action = card.play(player);
    expect(action).is.not.undefined;

    const space = action.availableSpaces[0];
    action.cb(space);
    expect(space.tile && space.tile.tileType).to.eq(TileType.LAVA_FLOWS);
    expect(space.player).to.eq(player);
    expect(game.getTemperature()).to.eq(-26);
    expect(space.adjacency?.bonus).eq(undefined);
  });
});
