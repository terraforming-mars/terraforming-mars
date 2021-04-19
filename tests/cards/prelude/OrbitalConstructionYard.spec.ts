import {expect} from 'chai';
import {OrbitalConstructionYard} from '../../../src/cards/prelude/OrbitalConstructionYard';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';


describe('OrbitalConstructionYard', function() {
  it('Should play', function() {
    const card = new OrbitalConstructionYard();
    const player = TestPlayers.BLUE.newPlayer();
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
    expect(player.titanium).to.eq(4);
  });
});
