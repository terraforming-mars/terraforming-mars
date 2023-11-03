import {expect} from 'chai';
import {Donation} from '../../../src/server/cards/prelude/Donation';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('Donation', function() {
  it('Should play', function() {
    const card = new Donation();
    const [/* game */, player] = testGame(1);
    cast(card.play(player), undefined);
    expect(player.megaCredits).to.eq(21);
  });
});
