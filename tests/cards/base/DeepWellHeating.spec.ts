import {expect} from 'chai';
import {DeepWellHeating} from '../../../src/cards/base/DeepWellHeating';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/common/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('DeepWellHeating', function() {
  it('Should play', function() {
    const card = new DeepWellHeating();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, redPlayer], player);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.ENERGY)).to.eq(1);
    expect(game.getTemperature()).to.eq(-28);
  });
});
