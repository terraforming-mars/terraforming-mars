import {expect} from 'chai';
import {GeothermalPower} from '../../../src/server/cards/base/GeothermalPower';
import {TestPlayer} from '../../TestPlayer';

describe('GeothermalPower', function() {
  it('Should play', function() {
    const card = new GeothermalPower();
    const player = TestPlayer.BLUE.newPlayer();
    const action = player.simplePlay(card);
    expect(action).is.undefined;
    expect(player.production.energy).to.eq(2);
  });
});
