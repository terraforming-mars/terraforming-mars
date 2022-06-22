import {expect} from 'chai';
import {LunaGovernor} from '../../../src/cards/colonies/LunaGovernor';
import {Resources} from '../../../src/common/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('LunaGovernor', function() {
  it('Should play', function() {
    const card = new LunaGovernor();
    const player = TestPlayers.BLUE.newPlayer();
    expect(player.canPlayIgnoringCost(card)).is.not.true;
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);
  });
});
