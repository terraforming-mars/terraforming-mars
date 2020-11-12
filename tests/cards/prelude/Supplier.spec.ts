
import {expect} from 'chai';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {Supplier} from '../../../src/cards/prelude/Supplier';

describe('Supplier', function() {
  it('Should play', function() {
    const player = new Player('foo', Color.BLUE, false);
    const card = new Supplier();
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.ENERGY)).to.eq(2);
    expect(player.steel).to.eq(4);
  });
});
