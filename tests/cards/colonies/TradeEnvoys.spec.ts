import {expect} from 'chai';
import {TradeEnvoys} from '../../../src/server/cards/colonies/TradeEnvoys';
import {Ceres} from '../../../src/server/colonies/Ceres';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('TradeEnvoys', function() {
  it('Should play', function() {
    const card = new TradeEnvoys();
    const [/* skipped */, player] = testGame(2);
    cast(card.play(player), undefined);
    const ceres = new Ceres();
    ceres.trade(player);
    expect(player.steel).to.eq(3);
  });
});
