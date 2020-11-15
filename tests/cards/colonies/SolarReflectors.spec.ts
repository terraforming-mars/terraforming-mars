import {expect} from 'chai';
import {SolarReflectors} from '../../../src/cards/colonies/SolarReflectors';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';

describe('SolarReflectors', function() {
  it('Should play', function() {
    const card = new SolarReflectors();
    const player = new Player('test', Color.BLUE, false);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.HEAT)).to.eq(5);
  });
});
