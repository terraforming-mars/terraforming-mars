import {expect} from 'chai';
import {MetalsCompany} from '../../../src/server/cards/prelude/MetalsCompany';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';

describe('MetalsCompany', function() {
  it('Should play', function() {
    const card = new MetalsCompany();
    const player = TestPlayer.BLUE.newPlayer();
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
    expect(player.getProduction(Resources.STEEL)).to.eq(1);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
  });
});
