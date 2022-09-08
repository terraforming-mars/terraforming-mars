import {expect} from 'chai';
import {newTestGame} from '../../TestGame';
import {UNMIContractor} from '../../../src/server/cards/prelude/UNMIContractor';

describe('UNMIContractor', function() {
  it('Should play', function() {
    const game = newTestGame(1);
    const player = game.testPlayers[0];
    const card = new UNMIContractor();
    card.play(player);

    expect(player.getTerraformRating()).to.eq(17);
    expect(player.cardsInHand).has.lengthOf(1);
  });
});
