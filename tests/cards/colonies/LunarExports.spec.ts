import {expect} from 'chai';
import {LunarExports} from '../../../src/cards/colonies/LunarExports';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Resources} from '../../../src/Resources';

describe('LunarExports', function() {
  it('Should play', function() {
    const card = new LunarExports();
    const player = new Player('test', Color.BLUE, false);
    const orOptions = card.play(player) as OrOptions;
    expect(orOptions).is.not.undefined;
    expect(orOptions instanceof OrOptions).is.true;
    orOptions.options[0].cb();
    expect(player.getProduction(Resources.PLANTS)).to.eq(2);
  });
});
