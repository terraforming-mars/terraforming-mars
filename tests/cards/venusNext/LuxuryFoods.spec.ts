import {expect} from 'chai';
import {LuxuryFoods} from '../../../src/cards/venusNext/LuxuryFoods';
import {TestPlayers} from '../../TestPlayers';

describe('LuxuryFoods', function() {
  it('Should play', function() {
    const card = new LuxuryFoods();
    const player = TestPlayers.BLUE.newPlayer();
    expect(card.canPlay(player)).is.not.true;
    const action = card.play();
    expect(action).is.undefined;
    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(2);
  });
});
