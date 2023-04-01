import {expect} from 'chai';
import {Game} from '../../../src/server/Game';
import {TileType} from '../../../src/common/TileType';
import {cast, resetBoard, runAllActions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {LavaFlowsAres} from '../../../src/server/cards/ares/LavaFlowsAres';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {ARES_OPTIONS_NO_HAZARDS} from '../../ares/AresTestHelper';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {testGame} from '../../TestGame';

describe('LavaFlowsAres', function() {
  let card: LavaFlowsAres;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new LavaFlowsAres();
    [game, player] = testGame(2, ARES_OPTIONS_NO_HAZARDS);
    resetBoard(game);
  });

  it('Should play', function() {
    card.play(player);
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectSpace);
    const space = action.availableSpaces[0];
    action.cb(space);

    expect(space.tile && space.tile.tileType).to.eq(TileType.LAVA_FLOWS);
    expect(space.player).to.eq(player);
    expect(game.getTemperature()).to.eq(-26);
    expect(space.adjacency).to.deep.eq({bonus: [SpaceBonus.HEAT, SpaceBonus.HEAT]});
  });
});
