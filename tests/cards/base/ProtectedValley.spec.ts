import {expect} from 'chai';
import {ProtectedValley} from '../../../src/cards/base/ProtectedValley';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';
import {TileType} from '../../../src/TileType';
import {TestPlayers} from '../../TestingUtils';

describe('ProtectedValley', function() {
  it('Should play', function() {
    const card = new ProtectedValley();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    const game = new Game('foobar', [player, redPlayer], player);
    const action = card.play(player, game);
    expect(action).is.not.undefined;
    action.cb(action.availableSpaces[0]);
    expect(action.availableSpaces[0].tile && action.availableSpaces[0].tile.tileType).to.eq(TileType.GREENERY);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);
    expect(game.getOxygenLevel()).to.eq(1);
  });
});
