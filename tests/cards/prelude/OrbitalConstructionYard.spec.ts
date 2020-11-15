
import {expect} from 'chai';
import {OrbitalConstructionYard} from '../../../src/cards/prelude/OrbitalConstructionYard';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';

describe('OrbitalConstructionYard', function() {
  it('Should play', function() {
    const card = new OrbitalConstructionYard();
    const player = new Player('test', Color.BLUE, false);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
    expect(player.titanium).to.eq(4);
  });
});
