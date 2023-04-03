import {expect} from 'chai';
import {TradeEnvoys} from '../../../src/server/cards/colonies/TradeEnvoys';
import {Ceres} from '../../../src/server/colonies/Ceres';
import {testGame} from '../../TestGame';

describe('TradeEnvoys', function() {
  it('Should play', function() {
    const card = new TradeEnvoys();
    const [, player] = testGame(2);
    const action = card.play(player);
    expect(action).is.undefined;
    const ceres = new Ceres();
    ceres.trade(player);
    expect(player.steel).to.eq(3);
  });
});
