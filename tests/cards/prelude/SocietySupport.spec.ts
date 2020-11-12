
import {expect} from 'chai';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {SocietySupport} from '../../../src/cards/prelude/SocietySupport';

describe('SocietySupport', function() {
  it('Should play', function() {
    const player = new Player('foo', Color.BLUE, false);
    const card = new SocietySupport();
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(-1);
    expect(player.getProduction(Resources.PLANTS)).to.eq(1);
    expect(player.getProduction(Resources.ENERGY)).to.eq(1);
    expect(player.getProduction(Resources.HEAT)).to.eq(1);
  });
});
