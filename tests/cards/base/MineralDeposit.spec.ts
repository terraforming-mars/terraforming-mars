import {expect} from 'chai';
import {MineralDeposit} from '../../../src/server/cards/base/MineralDeposit';
import {testGame} from '../../TestGame';

describe('MineralDeposit', function() {
  it('Should play', function() {
    const card = new MineralDeposit();
    const [, player] = testGame(2);
    cast(card.play(player), undefined);
    expect(player.steel).to.eq(5);
  });
});
