import {expect} from 'chai';
import {DeepWellHeating} from '../../../src/server/cards/base/DeepWellHeating';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';

describe('DeepWellHeating', function() {
  it('Should play', function() {
    const card = new DeepWellHeating();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('gameid', [player, redPlayer], player);
    const action = player.playCard(card);
    expect(action).is.undefined;
    expect(player.production.energy).to.eq(1);
    expect(game.getTemperature()).to.eq(-28);
  });
});
