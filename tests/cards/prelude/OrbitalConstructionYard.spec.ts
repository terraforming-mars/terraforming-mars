import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {OrbitalConstructionYard} from '../../../src/server/cards/prelude/OrbitalConstructionYard';


describe('OrbitalConstructionYard', function() {
  it('Should play', function() {
    const card = new OrbitalConstructionYard();
    const [, player] = testGame(1);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.titanium).to.eq(1);
    expect(player.titanium).to.eq(4);
  });
});
