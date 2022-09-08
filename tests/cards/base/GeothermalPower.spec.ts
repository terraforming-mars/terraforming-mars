import {expect} from 'chai';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {GeothermalPower} from '../../../src/server/cards/base/GeothermalPower';

describe('GeothermalPower', function() {
  it('Should play', function() {
    const card = new GeothermalPower();
    const game = newTestGame(1);
    const player = getTestPlayer(game, 0);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.energy).to.eq(2);
  });
});
