import {expect} from 'chai';
import {VenusGovernor} from '../../../src/server/cards/venusNext/VenusGovernor';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('VenusGovernor', function() {
  it('Should play', function() {
    const card = new VenusGovernor();
    const game = newTestGame(1);
    const player = getTestPlayer(game, 0);

    player.tagsForTest = {venus: 1};
    expect(player.canPlayIgnoringCost(card)).is.not.true;
    player.tagsForTest = {venus: 2};
    expect(player.canPlayIgnoringCost(card)).is.true;

    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.megacredits).to.eq(2);
  });
});
