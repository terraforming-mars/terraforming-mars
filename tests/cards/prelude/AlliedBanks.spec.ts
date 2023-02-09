import {expect} from 'chai';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {AlliedBanks} from '../../../src/server/cards/prelude/AlliedBanks';

describe('AlliedBanks', function() {
  it('Should play', function() {
    const card = new AlliedBanks();
    const game = newTestGame(1);
    const player = getTestPlayer(game, 0);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.megaCredits).to.eq(3);
    expect(player.production.megacredits).to.eq(4);
  });
});
