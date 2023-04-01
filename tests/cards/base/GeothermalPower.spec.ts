import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {GeothermalPower} from '../../../src/server/cards/base/GeothermalPower';

describe('GeothermalPower', function() {
  it('Should play', function() {
    const card = new GeothermalPower();
    const [, player] = testGame(1);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.energy).to.eq(2);
  });
});
