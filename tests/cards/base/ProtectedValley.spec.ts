import {expect} from 'chai';
import {ProtectedValley} from '../../../src/server/cards/base/ProtectedValley';
import {Game} from '../../../src/server/Game';
import {TileType} from '../../../src/common/TileType';
import {TestPlayer} from '../../TestPlayer';

describe('ProtectedValley', function() {
  it('Should play', function() {
    const card = new ProtectedValley();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('gameid', [player, redPlayer], player);
    const action = card.play(player);
    expect(action).is.not.undefined;
    action.cb(action.availableSpaces[0]);
    expect(action.availableSpaces[0].tile && action.availableSpaces[0].tile.tileType).to.eq(TileType.GREENERY);
    expect(player.production.megacredits).to.eq(2);
    expect(game.getOxygenLevel()).to.eq(1);
  });
});
