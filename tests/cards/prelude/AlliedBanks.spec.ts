import {expect} from 'chai';
import {AlliedBanks} from '../../../src/cards/prelude/AlliedBanks';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('AlliedBanks', function() {
  it('Should play', function() {
    const card = new AlliedBanks();
    const player = TestPlayers.BLUE.newPlayer();
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.megaCredits).to.eq(3);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(4);
  });
});
