import {expect} from 'chai';
import {LunaGovernor} from '../../../src/server/cards/colonies/LunaGovernor';
import {TestPlayer} from '../../TestPlayer';

describe('LunaGovernor', function() {
  it('Should play', function() {
    const card = new LunaGovernor();
    const player = TestPlayer.BLUE.newPlayer();
    expect(player.canPlayIgnoringCost(card)).is.not.true;
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.megacredits).to.eq(2);
  });
});
