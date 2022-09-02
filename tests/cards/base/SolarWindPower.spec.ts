
import {expect} from 'chai';
import {SolarWindPower} from '../../../src/server/cards/base/SolarWindPower';
import {TestPlayer} from '../../TestPlayer';

describe('SolarWindPower', function() {
  it('Should play', function() {
    const card = new SolarWindPower();
    const player = TestPlayer.BLUE.newPlayer();
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.energy).to.eq(1);
    expect(player.titanium).to.eq(2);
  });
});
