import {expect} from 'chai';
import {Mine} from '../../../src/server/cards/base/Mine';
import {TestPlayer} from '../../TestPlayer';

describe('Mine', function() {
  it('Should play', function() {
    const card = new Mine();
    const player = TestPlayer.BLUE.newPlayer();
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.steel).to.eq(1);
  });
});
