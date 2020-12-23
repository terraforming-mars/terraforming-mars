import {expect} from 'chai';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {TileType} from '../../../src/TileType';
import {RestrictedAreaAres} from '../../../src/cards/ares/RestrictedAreaAres';
import {SpaceBonus} from '../../../src/SpaceBonus';
import {ARES_OPTIONS_NO_HAZARDS} from '../../ares/AresTestHelper';
import {TestPlayers} from '../../TestingUtils';

describe('RestrictedAreaAres', function() {
  let card : RestrictedAreaAres; let player : Player; let game : Game;

  beforeEach(function() {
    card = new RestrictedAreaAres();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player, ARES_OPTIONS_NO_HAZARDS);
  });

  it('Should play', function() {
    const action = card.play(player, game);
    expect(action).is.not.undefined;

    const space = action.availableSpaces[0];

    action.cb(space);
    expect(space.tile && space.tile.tileType).to.eq(TileType.RESTRICTED_AREA);
    expect(space.adjacency).to.deep.eq({bonus: [SpaceBonus.DRAW_CARD]});
  });
});
