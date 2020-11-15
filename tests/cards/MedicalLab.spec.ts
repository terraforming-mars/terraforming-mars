
import {expect} from 'chai';
import {MedicalLab} from '../../src/cards/MedicalLab';
import {Color} from '../../src/Color';
import {Player} from '../../src/Player';
import {Capital} from '../../src/cards/Capital';
import {Resources} from '../../src/Resources';

describe('MedicalLab', function() {
  it('Should play', function() {
    const card = new MedicalLab();
    const player = new Player('test', Color.BLUE, false);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(0);
    player.playedCards.push(new Capital());
    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
  });
});
