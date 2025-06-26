import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {AlliedBanks} from '../../../src/server/cards/prelude/AlliedBanks';
import {cast} from '../../TestingUtils';

describe('AlliedBanks', () => {
  it('Should play', () => {
    const card = new AlliedBanks();
    const [/* game */, player] = testGame(1);
    cast(card.play(player), undefined);
    expect(player.megaCredits).to.eq(3);
    expect(player.production.megacredits).to.eq(4);
  });
});
