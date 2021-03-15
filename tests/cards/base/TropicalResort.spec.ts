
import {expect} from 'chai';
import {TropicalResort} from '../../../src/cards/base/TropicalResort';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('TropicalResort', function() {
  it('Should play', function() {
    const card = new TropicalResort();
    const player = TestPlayers.BLUE.newPlayer();
    player.addProduction(Resources.HEAT, 2);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.HEAT)).to.eq(0);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(3);
    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(2);
  });
});
