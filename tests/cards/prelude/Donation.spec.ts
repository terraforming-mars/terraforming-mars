import {expect} from 'chai';
import {Donation} from '../../../src/cards/prelude/Donation';
import {TestPlayers} from '../../TestPlayers';

describe('Donation', function() {
  it('Should play', function() {
    const card = new Donation();
    const player = TestPlayers.BLUE.newPlayer();
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.megaCredits).to.eq(21);
  });
});
