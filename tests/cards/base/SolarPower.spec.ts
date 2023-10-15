import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {SolarPower} from '../../../src/server/cards/base/SolarPower';
import {cast} from '../../TestingUtils';

describe('SolarPower', function() {
  it('Should play', function() {
    const card = new SolarPower();
    const [/* skipped */, player] = testGame(1);
    cast(card.play(player), undefined);
    expect(player.production.energy).to.eq(1);
    expect(card.getVictoryPoints(player)).to.eq(1);
  });
});
