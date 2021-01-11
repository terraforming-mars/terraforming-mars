import {expect} from 'chai';
import {AtalantaPlanitiaLab} from '../../../src/cards/venusNext/AtalantaPlanitiaLab';
import {TestPlayers} from '../../TestingUtils';

describe('AtalantaPlanitiaLab', function() {
  it('Should play', function() {
    const card = new AtalantaPlanitiaLab();
    const player = TestPlayers.BLUE.newPlayer();
    expect(card.canPlay(player)).is.not.true;
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.cardsInHand).has.lengthOf(2);
    expect(card.getVictoryPoints()).to.eq(2);
  });
});
