import {expect} from 'chai';
import {Mine} from '../../../src/cards/base/Mine';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';

describe('Mine', function() {
  it('Should play', function() {
    const card = new Mine();
    const player = TestPlayer.BLUE.newPlayer();
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.STEEL)).to.eq(1);
  });
});
