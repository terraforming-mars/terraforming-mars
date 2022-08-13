import {expect} from 'chai';
import {AtalantaPlanitiaLab} from '../../../src/server/cards/venusNext/AtalantaPlanitiaLab';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';

describe('AtalantaPlanitiaLab', function() {
  it('Should play', function() {
    const card = new AtalantaPlanitiaLab();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
    expect(player.canPlayIgnoringCost(card)).is.not.true;
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.cardsInHand).has.lengthOf(2);
    expect(card.getVictoryPoints()).to.eq(2);
  });
});
