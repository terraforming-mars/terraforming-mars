import {expect} from 'chai';
import {Donation} from '../../../src/server/cards/prelude/Donation';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('Donation', function() {
  it('Should play', function() {
    const card = new Donation();
    const game = newTestGame(1);
    const player = getTestPlayer(game, 0);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.megaCredits).to.eq(21);
  });
});
