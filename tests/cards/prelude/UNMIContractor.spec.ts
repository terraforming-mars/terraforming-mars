import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {UNMIContractor} from '../../../src/server/cards/prelude/UNMIContractor';

describe('UNMIContractor', function() {
  it('Should play', function() {
    const [/* game */, player] = testGame(1);
    const card = new UNMIContractor();
    card.play(player);

    expect(player.getTerraformRating()).to.eq(17);
    expect(player.cardsInHand).has.lengthOf(1);
  });
});
