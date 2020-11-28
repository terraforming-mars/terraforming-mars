
import {expect} from 'chai';
import {AdaptationTechnology} from '../../../src/cards/base/AdaptationTechnology';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';

describe('AdaptationTechnology', function() {
  it('Should play', function() {
    const card = new AdaptationTechnology();
    const player = new Player('test', Color.BLUE, false);
    card.play();
    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
    expect(card.getRequirementBonus()).to.eq(2);
  });
});
