import {expect} from 'chai';
import {OrbitalReflectors} from '../../../src/server/cards/venusNext/OrbitalReflectors';
import {testGame} from '../../TestGame';

describe('OrbitalReflectors', function() {
  it('Should play', function() {
    const card = new OrbitalReflectors();
    const [game, player] = testGame(2);

    const action = card.play(player);
    expect(action).is.undefined;
    expect(game.getVenusScaleLevel()).to.eq(4);
    expect(player.production.heat).to.eq(2);
  });
});
