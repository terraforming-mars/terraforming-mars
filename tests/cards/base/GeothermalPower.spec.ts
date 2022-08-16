import {expect} from 'chai';
import {GeothermalPower} from '../../../src/server/cards/base/GeothermalPower';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';

describe('GeothermalPower', function() {
  it('Should play', function() {
    const card = new GeothermalPower();
    const player = TestPlayer.BLUE.newPlayer();
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.ENERGY)).to.eq(2);
  });
});
