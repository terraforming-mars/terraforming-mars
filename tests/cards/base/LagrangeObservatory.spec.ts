import {expect} from 'chai';
import {LagrangeObservatory} from '../../../src/cards/base/LagrangeObservatory';
import {TestPlayers} from '../../TestingUtils';

describe('LagrangeObservatory', function() {
  it('Should play', function() {
    const card = new LagrangeObservatory();
    const player = TestPlayers.BLUE.newPlayer();
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.cardsInHand).has.lengthOf(1);
    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
  });
});
