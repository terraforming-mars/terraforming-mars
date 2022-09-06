import {expect} from 'chai';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {UNMIContractor} from '../../../src/server/cards/prelude/UNMIContractor';

describe('UNMIContractor', function() {
  it('Should play', function() {
    const game = newTestGame(1);
    const player = getTestPlayer(game, 0);
    const card = new UNMIContractor();
    card.play(player);

    expect(player.getTerraformRating()).to.eq(17);
    expect(player.cardsInHand).has.lengthOf(1);
  });
});
