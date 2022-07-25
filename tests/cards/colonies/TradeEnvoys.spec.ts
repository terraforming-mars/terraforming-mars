import {expect} from 'chai';
import {TradeEnvoys} from '../../../src/cards/colonies/TradeEnvoys';
import {Ceres} from '../../../src/colonies/Ceres';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';

describe('TradeEnvoys', function() {
  it('Should play', function() {
    const card = new TradeEnvoys();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
    const action = card.play(player);
    expect(action).is.undefined;
    const ceres = new Ceres();
    ceres.trade(player);
    expect(player.steel).to.eq(3);
  });
});
