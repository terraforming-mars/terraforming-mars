import {expect} from 'chai';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {TileType} from '../../../src/TileType';
import {resetBoard, TestPlayers} from '../../TestingUtils';
import {LavaFlowsAres} from '../../../src/cards/ares/LavaFlowsAres';
import {SpaceBonus} from '../../../src/SpaceBonus';
import {ARES_OPTIONS_NO_HAZARDS} from '../../ares/AresTestHelper';

describe('LavaFlowsAres', function() {
  let card : LavaFlowsAres; let player : Player; let game : Game;

  beforeEach(function() {
    card = new LavaFlowsAres();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player, ARES_OPTIONS_NO_HAZARDS);
    resetBoard(game);
  });

  it('Should play', function() {
    const action = card.play(player, game);
    expect(action).is.not.undefined;

    const space = action.availableSpaces[0];
    action.cb(space);
    expect(space.tile && space.tile.tileType).to.eq(TileType.LAVA_FLOWS);
    expect(space.player).to.eq(player);
    expect(game.getTemperature()).to.eq(-26);
    expect(space.adjacency).to.deep.eq({bonus: [SpaceBonus.HEAT, SpaceBonus.HEAT]});
  });
});
