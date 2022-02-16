
import {expect} from 'chai';
import {SolarPower} from '../../../src/cards/base/SolarPower';
import {Resources} from '../../../src/common/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('SolarPower', function() {
  it('Should play', function() {
    const card = new SolarPower();
    const player = TestPlayers.BLUE.newPlayer();
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.ENERGY)).to.eq(1);
    expect(card.getVictoryPoints()).to.eq(1);
  });
});
