
import {expect} from 'chai';
import {SolarWindPower} from '../../../src/cards/base/SolarWindPower';
import {Resources} from '../../../src/common/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('SolarWindPower', function() {
  it('Should play', function() {
    const card = new SolarWindPower();
    const player = TestPlayers.BLUE.newPlayer();
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.ENERGY)).to.eq(1);
    expect(player.titanium).to.eq(2);
  });
});
