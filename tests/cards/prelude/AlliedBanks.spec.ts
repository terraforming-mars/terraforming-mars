import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {AlliedBanks} from '../../../src/server/cards/prelude/AlliedBanks';

describe('AlliedBanks', function() {
  it('Should play', function() {
    const card = new AlliedBanks();
    const [, player] = testGame(1);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.megaCredits).to.eq(3);
    expect(player.production.megacredits).to.eq(4);
  });
});
