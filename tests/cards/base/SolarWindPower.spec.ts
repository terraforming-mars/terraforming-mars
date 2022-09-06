import {expect} from 'chai';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {SolarWindPower} from '../../../src/server/cards/base/SolarWindPower';

describe('SolarWindPower', function() {
  it('Should play', function() {
    const card = new SolarWindPower();
    const game = newTestGame(1);
    const player = getTestPlayer(game, 0);

    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.energy).to.eq(1);
    expect(player.titanium).to.eq(2);
  });
});
