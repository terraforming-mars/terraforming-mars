import {expect} from 'chai';
import {GeothermalPower} from '../../../src/cards/base/GeothermalPower';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('GeothermalPower', function() {
  it('Should play', function() {
    const card = new GeothermalPower();
    const player = TestPlayers.BLUE.newPlayer();
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.ENERGY)).to.eq(2);
  });
});
