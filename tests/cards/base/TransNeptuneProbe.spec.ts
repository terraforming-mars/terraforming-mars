
import {expect} from 'chai';
import {TransNeptuneProbe} from '../../../src/cards/base/TransNeptuneProbe';
import {TestPlayers} from '../../TestingUtils';

describe('TransNeptuneProbe', function() {
  it('Should play', function() {
    const card = new TransNeptuneProbe();
    const player = TestPlayers.BLUE.newPlayer();
    const action = card.play();
    expect(action).is.undefined;
    player.victoryPointsBreakdown.cardVPs(card.name, card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
  });
});
