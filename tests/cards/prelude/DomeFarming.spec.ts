
import {expect} from 'chai';
import {DomeFarming} from '../../../src/cards/prelude/DomeFarming';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';

describe('DomeFarming', function() {
  it('Should play', function() {
    const card = new DomeFarming();
    const player = new Player('test', Color.BLUE, false);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.PLANTS)).to.eq(1);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);
  });
});
