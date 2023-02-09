import {expect} from 'chai';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {Mine} from '../../../src/server/cards/base/Mine';

describe('Mine', function() {
  it('Should play', function() {
    const card = new Mine();
    const game = newTestGame(1);
    const player = getTestPlayer(game, 0);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.steel).to.eq(1);
  });
});
