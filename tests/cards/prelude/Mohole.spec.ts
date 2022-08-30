import {expect} from 'chai';
import {Mohole} from '../../../src/server/cards/prelude/Mohole';
import {TestPlayer} from '../../TestPlayer';

describe('Mohole', function() {
  it('Should play', function() {
    const card = new Mohole();
    const player = TestPlayer.BLUE.newPlayer();
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.heat).to.eq(3);
    expect(player.heat).to.eq(3);
  });
});
