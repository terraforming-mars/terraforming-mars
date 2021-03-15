
import {expect} from 'chai';
import {AdaptationTechnology} from '../../../src/cards/base/AdaptationTechnology';
import {TestPlayers} from '../../TestingUtils';

describe('AdaptationTechnology', function() {
  it('Should play', function() {
    const card = new AdaptationTechnology();
    const player = TestPlayers.BLUE.newPlayer();

    card.play();
    player.victoryPointsBreakdown.cardVPs(card.name, card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
    expect(card.getRequirementBonus()).to.eq(2);
  });
});
