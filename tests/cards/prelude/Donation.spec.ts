
import {expect} from 'chai';
import {Donation} from '../../../src/cards/prelude/Donation';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';

describe('Donation', function() {
  it('Should play', function() {
    const card = new Donation();
    const player = new Player('test', Color.BLUE, false);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.megaCredits).to.eq(21);
  });
});
