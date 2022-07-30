import {expect} from 'chai';
import {MoholeExcavation} from '../../../src/cards/prelude/MoholeExcavation';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';

describe('MoholeExcavation', function() {
  it('Should play', function() {
    const card = new MoholeExcavation();
    const player = TestPlayer.BLUE.newPlayer();
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.HEAT)).to.eq(2);
    expect(player.heat).to.eq(2);
    expect(player.getProduction(Resources.STEEL)).to.eq(1);
  });
});
