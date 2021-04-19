import {expect} from 'chai';
import {ProtectedValley} from '../../../src/cards/base/ProtectedValley';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';
import {TileType} from '../../../src/TileType';
import {TestPlayers} from '../../TestPlayers';

describe('ProtectedValley', function() {
  it('Should play', function() {
    const card = new ProtectedValley();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, redPlayer], player);
    const action = card.play(player);
    expect(action).is.not.undefined;
    action.cb(action.availableSpaces[0]);
    expect(action.availableSpaces[0].tile && action.availableSpaces[0].tile.tileType).to.eq(TileType.GREENERY);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);
    expect(game.getOxygenLevel()).to.eq(1);
  });
});
