
import {expect} from 'chai';
import {AsteroidMining} from '../../src/cards/AsteroidMining';
import {Color} from '../../src/Color';
import {Player} from '../../src/Player';
import {Resources} from '../../src/Resources';

describe('AsteroidMining', function() {
  it('Should play', function() {
    const card = new AsteroidMining();
    const player = new Player('test', Color.BLUE, false);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.TITANIUM)).to.eq(2);
    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(2);
  });
});
