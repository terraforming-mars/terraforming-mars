
import {expect} from 'chai';
import {Mine} from '../../src/cards/Mine';
import {Color} from '../../src/Color';
import {Player} from '../../src/Player';
import {Resources} from '../../src/Resources';

describe('Mine', function() {
  it('Should play', function() {
    const card = new Mine();
    const player = new Player('test', Color.BLUE, false);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.STEEL)).to.eq(1);
  });
});
