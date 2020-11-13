
import {expect} from 'chai';
import {MoholeExcavation} from '../../../src/cards/prelude/MoholeExcavation';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';

describe('MoholeExcavation', function() {
  it('Should play', function() {
    const card = new MoholeExcavation();
    const player = new Player('test', Color.BLUE, false);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.HEAT)).to.eq(2);
    expect(player.heat).to.eq(2);
    expect(player.getProduction(Resources.STEEL)).to.eq(1);
  });
});
