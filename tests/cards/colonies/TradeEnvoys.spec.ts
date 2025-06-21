import {expect} from 'chai';
import {TradeEnvoys} from '../../../src/server/cards/colonies/TradeEnvoys';
import {Ceres} from '../../../src/server/colonies/Ceres';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('TradeEnvoys', () => {
  it('Should play', () => {
    const card = new TradeEnvoys();
    const [/* game */, player] = testGame(2);
    cast(card.play(player), undefined);
    const ceres = new Ceres();
    ceres.trade(player);
    expect(player.steel).to.eq(3);
  });
});
