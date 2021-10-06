import {expect} from 'chai';
import {VenusGovernor} from '../../../src/cards/venusNext/VenusGovernor';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('VenusGovernor', function() {
  it('Should play', function() {
    const card = new VenusGovernor();
    const player = TestPlayers.BLUE.newPlayer();
    expect(player.canPlayIgnoringCost(card)).is.not.true;
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);
  });
});
