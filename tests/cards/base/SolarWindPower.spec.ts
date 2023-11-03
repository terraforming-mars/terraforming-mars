import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {SolarWindPower} from '../../../src/server/cards/base/SolarWindPower';
import {cast} from '../../TestingUtils';

describe('SolarWindPower', function() {
  it('Should play', function() {
    const card = new SolarWindPower();
    const [/* game */, player] = testGame(1);

    cast(card.play(player), undefined);
    expect(player.production.energy).to.eq(1);
    expect(player.titanium).to.eq(2);
  });
});
