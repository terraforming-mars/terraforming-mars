import {expect} from 'chai';
import {LunaGovernor} from '../../../src/server/cards/colonies/LunaGovernor';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('LunaGovernor', function() {
  it('Should play', function() {
    const card = new LunaGovernor();
    const [/* game */, player] = testGame(1);
    expect(card.canPlay(player)).is.not.true;
    cast(card.play(player), undefined);
    expect(player.production.megacredits).to.eq(2);
  });
});
