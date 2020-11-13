
import {expect} from 'chai';
import {SolarWindPower} from '../../src/cards/SolarWindPower';
import {Color} from '../../src/Color';
import {Player} from '../../src/Player';
import {Resources} from '../../src/Resources';

describe('SolarWindPower', function() {
  it('Should play', function() {
    const card = new SolarWindPower();
    const player = new Player('test', Color.BLUE, false);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.ENERGY)).to.eq(1);
    expect(player.titanium).to.eq(2);
  });
});
