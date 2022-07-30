import {expect} from 'chai';
import {Supplier} from '../../../src/cards/prelude/Supplier';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';

describe('Supplier', function() {
  it('Should play', function() {
    const player = TestPlayer.BLUE.newPlayer();
    const card = new Supplier();
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.ENERGY)).to.eq(2);
    expect(player.steel).to.eq(4);
  });
});
