import {expect} from 'chai';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {TileType} from '../../../src/common/TileType';
import {RestrictedAreaAres} from '../../../src/cards/ares/RestrictedAreaAres';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {ARES_OPTIONS_NO_HAZARDS} from '../../ares/AresTestHelper';
import {TestPlayers} from '../../TestPlayers';

describe('RestrictedAreaAres', function() {
  let card : RestrictedAreaAres; let player : Player;

  beforeEach(function() {
    card = new RestrictedAreaAres();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player, ARES_OPTIONS_NO_HAZARDS);
  });

  it('Should play', function() {
    const action = card.play(player);
    expect(action).is.not.undefined;

    const space = action.availableSpaces[0];

    action.cb(space);
    expect(space.tile && space.tile.tileType).to.eq(TileType.RESTRICTED_AREA);
    expect(space.adjacency).to.deep.eq({bonus: [SpaceBonus.DRAW_CARD]});
  });
});
