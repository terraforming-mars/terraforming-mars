
import {expect} from 'chai';
import {Sponsors} from '../../../src/cards/base/Sponsors';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';

describe('Sponsors', function() {
  it('Should play', function() {
    const card = new Sponsors();
    const player = TestPlayer.BLUE.newPlayer();
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);
  });
});
