import {expect} from 'chai';
import {AtalantaPlanitiaLab} from '../../../src/cards/venusNext/AtalantaPlanitiaLab';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestPlayers';

describe('AtalantaPlanitiaLab', function() {
  it('Should play', function() {
    const card = new AtalantaPlanitiaLab();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
    expect(player.canPlayIgnoringCost(card)).is.not.true;
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.cardsInHand).has.lengthOf(2);
    expect(card.getVictoryPoints()).to.eq(2);
  });
});
