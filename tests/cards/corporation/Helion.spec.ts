
import {expect} from 'chai';
import {Helion} from '../../../src/cards/corporation/Helion';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';

describe('Helion', function() {
  it('Should play', function() {
    const card = new Helion();
    const player = new Player('test', Color.BLUE, false);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.HEAT)).to.eq(3);
    expect(player.canUseHeatAsMegaCredits).is.true;
  });
});
