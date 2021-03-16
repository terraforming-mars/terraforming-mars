
import {expect} from 'chai';
import {CallistoPenalMines} from '../../../src/cards/base/CallistoPenalMines';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('CallistoPenalMines', function() {
  it('Should play', function() {
    const card = new CallistoPenalMines();
    const player = TestPlayers.BLUE.newPlayer();
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(3);
    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(2);
  });
});
