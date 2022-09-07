import {expect} from 'chai';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {OrbitalConstructionYard} from '../../../src/server/cards/prelude/OrbitalConstructionYard';


describe('OrbitalConstructionYard', function() {
  it('Should play', function() {
    const card = new OrbitalConstructionYard();
    const game = newTestGame(1);
    const player = getTestPlayer(game, 0);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.titanium).to.eq(1);
    expect(player.titanium).to.eq(4);
  });
});
