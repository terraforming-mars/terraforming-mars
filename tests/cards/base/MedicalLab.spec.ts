import {expect} from 'chai';
import {Capital} from '../../../src/cards/base/Capital';
import {MedicalLab} from '../../../src/cards/base/MedicalLab';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';

describe('MedicalLab', function() {
  it('Should play', function() {
    const card = new MedicalLab();
    const player = TestPlayer.BLUE.newPlayer();
    Game.newInstance('gameid', [player], player);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(0);
    player.playedCards.push(new Capital());
    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
    expect(card.getVictoryPoints()).to.eq(1);
  });
});
