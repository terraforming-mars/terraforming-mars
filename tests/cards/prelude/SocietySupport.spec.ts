import {expect} from 'chai';
import {SocietySupport} from '../../../src/cards/prelude/SocietySupport';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';

describe('SocietySupport', function() {
  it('Should play', function() {
    const player = TestPlayer.BLUE.newPlayer();
    const card = new SocietySupport();
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(-1);
    expect(player.getProduction(Resources.PLANTS)).to.eq(1);
    expect(player.getProduction(Resources.ENERGY)).to.eq(1);
    expect(player.getProduction(Resources.HEAT)).to.eq(1);
  });
});
