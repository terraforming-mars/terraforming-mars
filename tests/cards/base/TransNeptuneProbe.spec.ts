
import {expect} from 'chai';
import {TransNeptuneProbe} from '../../../src/cards/base/TransNeptuneProbe';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';

describe('TransNeptuneProbe', function() {
  it('Should play', function() {
    const card = new TransNeptuneProbe();
    const player = new Player('test', Color.BLUE, false);
    const action = card.play();
    expect(action).is.undefined;
    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
  });
});
