import {expect} from 'chai';
import {Mohole} from '../../../src/cards/prelude/Mohole';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';

describe('Mohole', function() {
  it('Should play', function() {
    const card = new Mohole();
    const player = TestPlayer.BLUE.newPlayer();
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.HEAT)).to.eq(3);
    expect(player.heat).to.eq(3);
  });
});
