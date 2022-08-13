import {expect} from 'chai';
import {Donation} from '../../../src/server/cards/prelude/Donation';
import {TestPlayer} from '../../TestPlayer';

describe('Donation', function() {
  it('Should play', function() {
    const card = new Donation();
    const player = TestPlayer.BLUE.newPlayer();
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.megaCredits).to.eq(21);
  });
});
