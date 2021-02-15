import {expect} from 'chai';
import {LavaFlows} from '../../../src/cards/base/LavaFlows';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {SpaceName} from '../../../src/SpaceName';
import {SpaceType} from '../../../src/SpaceType';
import {TileType} from '../../../src/TileType';
import {TestingUtils, TestPlayers} from '../../TestingUtils';

describe('LavaFlows', function() {
  let card : LavaFlows; let player : Player; let game : Game;

  beforeEach(function() {
    card = new LavaFlows();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
    TestingUtils.resetBoard(game);
  });

  it('Can\'t play if no available spaces', function() {
    game.addTile(player, SpaceType.LAND, game.board.getSpace(SpaceName.THARSIS_THOLUS), {tileType: TileType.LAVA_FLOWS});
    game.addTile(player, SpaceType.LAND, game.board.getSpace(SpaceName.ARSIA_MONS), {tileType: TileType.LAVA_FLOWS});
    game.addTile(player, SpaceType.LAND, game.board.getSpace(SpaceName.PAVONIS_MONS), {tileType: TileType.LAVA_FLOWS});

    const anotherPlayer = TestPlayers.RED.newPlayer();
    game.board.getSpace(SpaceName.ASCRAEUS_MONS).player = anotherPlayer; // land claim
    expect(card.canPlay(player)).is.not.true;
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
