import {expect} from 'chai';
import {VenusGovernor} from '../../../src/server/cards/venusNext/VenusGovernor';
import {TestPlayer} from '../../TestPlayer';

describe('VenusGovernor', function() {
  it('Should play', function() {
    const card = new VenusGovernor();
    const player = TestPlayer.BLUE.newPlayer();
    expect(player.canPlayIgnoringCost(card)).is.not.true;
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.megacredits).to.eq(2);
  });
});
