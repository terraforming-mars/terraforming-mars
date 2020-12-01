import {expect} from 'chai';
import {TradeEnvoys} from '../../../src/cards/colonies/TradeEnvoys';
import {Ceres} from '../../../src/colonies/Ceres';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestingUtils';

describe('TradeEnvoys', function() {
  it('Should play', function() {
    const card = new TradeEnvoys();
    const player = TestPlayers.BLUE.newPlayer();
    const game = new Game('foobar', [player, player], player);
    const action = card.play(player);
    expect(action).is.undefined;
    const ceres = new Ceres();
    ceres.trade(player, game);
    expect(player.steel).to.eq(3);
  });
});
