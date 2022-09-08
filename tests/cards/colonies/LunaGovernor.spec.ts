import {expect} from 'chai';
import {LunaGovernor} from '../../../src/server/cards/colonies/LunaGovernor';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('LunaGovernor', function() {
  it('Should play', function() {
    const card = new LunaGovernor();
    const game = newTestGame(1);
    const player = getTestPlayer(game, 0);
    expect(player.canPlayIgnoringCost(card)).is.not.true;
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.megacredits).to.eq(2);
  });
});
