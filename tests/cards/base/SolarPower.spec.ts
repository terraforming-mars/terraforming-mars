
import {expect} from 'chai';
import {SolarPower} from '../../../src/server/cards/base/SolarPower';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';

describe('SolarPower', function() {
  it('Should play', function() {
    const card = new SolarPower();
    const player = TestPlayer.BLUE.newPlayer();
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.ENERGY)).to.eq(1);
    expect(card.getVictoryPoints()).to.eq(1);
  });
});
