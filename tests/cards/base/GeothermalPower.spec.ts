import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {GeothermalPower} from '../../../src/server/cards/base/GeothermalPower';

describe('GeothermalPower', function() {
  it('Should play', function() {
    const card = new GeothermalPower();
    const [, player] = testGame(1);
    cast(card.play(player), undefined);
    expect(player.production.energy).to.eq(2);
  });
});
