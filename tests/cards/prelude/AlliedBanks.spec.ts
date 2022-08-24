import {expect} from 'chai';
import {AlliedBanks} from '../../../src/server/cards/prelude/AlliedBanks';
import {TestPlayer} from '../../TestPlayer';

describe('AlliedBanks', function() {
  it('Should play', function() {
    const card = new AlliedBanks();
    const player = TestPlayer.BLUE.newPlayer();
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.megaCredits).to.eq(3);
    expect(player.production.megacredits).to.eq(4);
  });
});
