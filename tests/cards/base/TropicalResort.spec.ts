
import {expect} from 'chai';
import {TropicalResort} from '../../../src/server/cards/base/TropicalResort';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';

describe('TropicalResort', function() {
  it('Should play', function() {
    const card = new TropicalResort();
    const player = TestPlayer.BLUE.newPlayer();
    player.production.add(Resources.HEAT, 2);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.heat).to.eq(0);
    expect(player.production.megacredits).to.eq(3);
    expect(card.getVictoryPoints()).to.eq(2);
  });
});
