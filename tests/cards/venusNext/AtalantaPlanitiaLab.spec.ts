import {expect} from 'chai';
import {AtalantaPlanitiaLab} from '../../../src/server/cards/venusNext/AtalantaPlanitiaLab';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('AtalantaPlanitiaLab', function() {
  it('Should play', function() {
    const card = new AtalantaPlanitiaLab();
    const game = newTestGame(2);
    const player = getTestPlayer(game, 0);
    expect(player.canPlayIgnoringCost(card)).is.not.true;
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.cardsInHand).has.lengthOf(2);
    expect(card.getVictoryPoints()).to.eq(2);
  });
});
