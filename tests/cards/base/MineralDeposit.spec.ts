import {expect} from 'chai';
import {MineralDeposit} from '../../../src/server/cards/base/MineralDeposit';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('MineralDeposit', () => {
  it('Should play', () => {
    const card = new MineralDeposit();
    const [/* game */, player] = testGame(2);
    cast(card.play(player), undefined);
    expect(player.steel).to.eq(5);
  });
});
