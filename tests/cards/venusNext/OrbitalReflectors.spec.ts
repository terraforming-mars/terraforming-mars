import {expect} from 'chai';
import {OrbitalReflectors} from '../../../src/server/cards/venusNext/OrbitalReflectors';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('OrbitalReflectors', function() {
  it('Should play', function() {
    const card = new OrbitalReflectors();
    const game = newTestGame(2);
    const player = getTestPlayer(game, 0);

    const action = card.play(player);
    expect(action).is.undefined;
    expect(game.getVenusScaleLevel()).to.eq(4);
    expect(player.production.heat).to.eq(2);
  });
});
