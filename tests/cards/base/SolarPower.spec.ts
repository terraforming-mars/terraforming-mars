import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {SolarPower} from '../../../src/server/cards/base/SolarPower';

describe('SolarPower', function() {
  it('Should play', function() {
    const card = new SolarPower();
    const [, player] = testGame(1);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.energy).to.eq(1);
    expect(card.getVictoryPoints(player)).to.eq(1);
  });
});
