import {expect} from 'chai';
import {Helion} from '../../../src/cards/corporation/Helion';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('Helion', function() {
  it('Should play', function() {
    const card = new Helion();
    const player = TestPlayers.BLUE.newPlayer();
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.HEAT)).to.eq(3);
    expect(player.canUseHeatAsMegaCredits).is.true;
  });
});
