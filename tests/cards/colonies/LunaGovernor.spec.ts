import {expect} from 'chai';
import {LunaGovernor} from '../../../src/server/cards/colonies/LunaGovernor';
import {testGame} from '../../TestGame';

describe('LunaGovernor', function() {
  it('Should play', function() {
    const card = new LunaGovernor();
    const [, player] = testGame(1);
    expect(player.simpleCanPlay(card)).is.not.true;
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.megacredits).to.eq(2);
  });
});
