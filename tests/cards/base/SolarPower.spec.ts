import {expect} from 'chai';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {SolarPower} from '../../../src/server/cards/base/SolarPower';

describe('SolarPower', function() {
  it('Should play', function() {
    const card = new SolarPower();
    const game = newTestGame(1);
    const player = getTestPlayer(game, 0);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.energy).to.eq(1);
    expect(card.getVictoryPoints()).to.eq(1);
  });
});
