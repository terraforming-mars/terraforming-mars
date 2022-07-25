import {expect} from 'chai';
import {OrbitalConstructionYard} from '../../../src/cards/prelude/OrbitalConstructionYard';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';


describe('OrbitalConstructionYard', function() {
  it('Should play', function() {
    const card = new OrbitalConstructionYard();
    const player = TestPlayer.BLUE.newPlayer();
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
    expect(player.titanium).to.eq(4);
  });
});
