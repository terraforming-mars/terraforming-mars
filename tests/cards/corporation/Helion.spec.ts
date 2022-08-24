import {expect} from 'chai';
import {Helion} from '../../../src/server/cards/corporation/Helion';
import {TestPlayer} from '../../TestPlayer';

describe('Helion', function() {
  it('Should play', function() {
    const card = new Helion();
    const player = TestPlayer.BLUE.newPlayer();
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.heat).to.eq(3);
    expect(player.canUseHeatAsMegaCredits).is.true;
  });
});
