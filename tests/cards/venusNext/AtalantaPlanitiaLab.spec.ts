import {expect} from 'chai';
import {AtalantaPlanitiaLab} from '../../../src/server/cards/venusNext/AtalantaPlanitiaLab';
import {testGame} from '../../TestGame';

describe('AtalantaPlanitiaLab', function() {
  it('Should play', function() {
    const card = new AtalantaPlanitiaLab();
    const [, player] = testGame(2);
    expect(player.canPlayIgnoringCost(card)).is.not.true;
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.cardsInHand).has.lengthOf(2);
    expect(card.getVictoryPoints()).to.eq(2);
  });
});
