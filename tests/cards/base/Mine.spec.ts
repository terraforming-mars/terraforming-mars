import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {Mine} from '../../../src/server/cards/base/Mine';

describe('Mine', function() {
  it('Should play', function() {
    const card = new Mine();
    const [, player] = testGame(1);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.steel).to.eq(1);
  });
});
